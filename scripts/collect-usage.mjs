import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir, platform } from 'node:os';
import { join } from 'node:path';

function walk(root) {
  if (!existsSync(root)) return [];
  return readdirSync(root, { withFileTypes: true }).flatMap((entry) => {
    const path = join(root, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

function finite(value) {
  const number = Number(value || 0);
  return Number.isFinite(number) && number > 0 ? number : 0;
}

function delta(current, previous) {
  return current >= previous ? current - previous : current;
}

function add(map, key, values) {
  const current = map.get(key) || {
    name: key,
    tokens: 0,
    inputTokens: 0,
    outputTokens: 0,
    cachedTokens: 0,
  };
  for (const field of ['tokens', 'inputTokens', 'outputTokens', 'cachedTokens']) {
    current[field] += finite(values[field]);
  }
  map.set(key, current);
}

function addDay(map, date, tokens) {
  if (!date || !tokens) return;
  map.set(date, (map.get(date) || 0) + tokens);
}

function sourceOutput(name, sessions, models, days) {
  return {
    name,
    sessions,
    models: [...models.values()].filter((model) => model.tokens > 0).sort((a, b) => b.tokens - a.tokens),
    days: [...days].map(([date, tokens]) => ({ date, tokens })).sort((a, b) => a.date.localeCompare(b.date)),
  };
}

function collectCodex() {
  const root = join(process.env.CODEX_HOME || join(homedir(), '.codex'), 'sessions');
  const models = new Map();
  const days = new Map();
  let sessions = 0;

  for (const file of walk(root).filter((path) => path.endsWith('.jsonl'))) {
    let model = 'codex';
    let used = false;
    let previous = { total: 0, input: 0, output: 0, cached: 0 };

    for (const line of readFileSync(file, 'utf8').split('\n')) {
      try {
        const event = JSON.parse(line);
        if (event.type === 'turn_context' && event.payload?.model) model = String(event.payload.model);
        const usage = event?.payload?.type === 'token_count' ? event.payload.info?.total_token_usage : null;
        if (!usage) continue;

        const current = {
          total: finite(usage.total_tokens),
          input: finite(usage.input_tokens),
          output: finite(usage.output_tokens),
          cached: finite(usage.cached_input_tokens),
        };
        if (!current.total) continue;

        const change = {
          tokens: delta(current.total, previous.total),
          inputTokens: delta(current.input, previous.input),
          outputTokens: delta(current.output, previous.output),
          cachedTokens: delta(current.cached, previous.cached),
        };
        previous = current;
        if (!change.tokens) continue;

        used = true;
        add(models, model, change);
        addDay(days, String(event.timestamp || '').slice(0, 10), change.tokens);
      } catch {}
    }

    if (used) sessions += 1;
  }

  return sourceOutput('codex', sessions, models, days);
}

function collectClaude() {
  const root = join(process.env.CLAUDE_CONFIG_DIR || join(homedir(), '.claude'), 'projects');
  const messages = new Map();

  for (const file of walk(root).filter((path) => path.endsWith('.jsonl'))) {
    for (const line of readFileSync(file, 'utf8').split('\n')) {
      if (!line.includes('"usage"')) continue;
      try {
        const event = JSON.parse(line);
        const usage = event?.message?.usage;
        const id = event?.message?.id;
        if (!usage || !id) continue;

        const input = finite(usage.input_tokens);
        const cacheCreation = finite(usage.cache_creation_input_tokens);
        const cacheRead = finite(usage.cache_read_input_tokens);
        const output = finite(usage.output_tokens);
        const record = {
          id: String(id),
          session: String(event.sessionId || ''),
          timestamp: String(event.timestamp || ''),
          model: String(event.message.model || 'claude'),
          tokens: input + cacheCreation + cacheRead + output,
          inputTokens: input + cacheCreation + cacheRead,
          outputTokens: output,
          cachedTokens: cacheRead,
        };

        const previous = messages.get(record.id);
        if (!previous || record.tokens > previous.tokens ||
            (record.tokens === previous.tokens && record.timestamp > previous.timestamp)) {
          messages.set(record.id, record);
        }
      } catch {}
    }
  }

  const models = new Map();
  const days = new Map();
  const sessions = new Set();
  for (const record of messages.values()) {
    if (!record.tokens || record.model === '<synthetic>') continue;
    add(models, record.model, record);
    addDay(days, record.timestamp.slice(0, 10), record.tokens);
    if (record.session) sessions.add(record.session);
  }

  return sourceOutput('claude', sessions.size, models, days);
}

const defaultDevice = platform() === 'darwin' ? 'mac' : platform() === 'win32' ? 'windows' : 'linux';
const device = String(process.env.AI_WORKBENCH_DEVICE || defaultDevice)
  .toLowerCase()
  .replace(/[^a-z0-9_-]+/g, '-');
const output = {
  schemaVersion: 1,
  device,
  platform: platform(),
  collectedAt: new Date().toISOString(),
  sources: [collectCodex(), collectClaude()],
};

mkdirSync('data/devices', { recursive: true });
writeFileSync(`data/devices/${device}.json`, `${JSON.stringify(output, null, 2)}\n`);

for (const source of output.sources) {
  const tokens = source.models.reduce((sum, model) => sum + model.tokens, 0);
  console.log(`${source.name}: ${source.sessions} sessions, ${source.models.length} models, ${tokens.toLocaleString()} tokens`);
}
