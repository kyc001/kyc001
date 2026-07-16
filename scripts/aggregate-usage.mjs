import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';

const deviceRoot = 'data/devices';
const files = existsSync(deviceRoot)
  ? readdirSync(deviceRoot).filter((file) => file.endsWith('.json')).sort()
  : [];
const devices = files.map((file) => JSON.parse(readFileSync(`${deviceRoot}/${file}`, 'utf8')));
const sourceMap = new Map();
const modelMap = new Map();
const dayMap = new Map();

for (const device of devices) {
  for (const source of device.sources || []) {
    const sourceTotal = sourceMap.get(source.name) || { name: source.name, tokens: 0, sessions: 0 };
    sourceTotal.sessions += Number(source.sessions || 0);

    for (const model of source.models || []) {
      const key = `${source.name}:${model.name}`;
      const total = modelMap.get(key) || {
        source: source.name,
        name: model.name,
        tokens: 0,
        inputTokens: 0,
        outputTokens: 0,
        cachedTokens: 0,
      };
      for (const field of ['tokens', 'inputTokens', 'outputTokens', 'cachedTokens']) {
        total[field] += Number(model[field] || 0);
      }
      modelMap.set(key, total);
      sourceTotal.tokens += Number(model.tokens || 0);
    }

    for (const day of source.days || []) {
      const total = dayMap.get(day.date) || { date: day.date, tokens: 0, sources: {} };
      const tokens = Number(day.tokens || 0);
      total.tokens += tokens;
      total.sources[source.name] = (total.sources[source.name] || 0) + tokens;
      dayMap.set(day.date, total);
    }

    sourceMap.set(source.name, sourceTotal);
  }
}

const output = {
  schemaVersion: 1,
  updatedAt: new Date().toISOString(),
  devices: devices.map((device) => ({
    name: device.device,
    platform: device.platform,
    collectedAt: device.collectedAt,
  })),
  sources: [...sourceMap.values()].sort((a, b) => b.tokens - a.tokens),
  models: [...modelMap.values()].sort((a, b) => b.tokens - a.tokens),
  days: [...dayMap.values()].sort((a, b) => a.date.localeCompare(b.date)),
};

mkdirSync('data', { recursive: true });
writeFileSync('data/usage.json', `${JSON.stringify(output, null, 2)}\n`);
console.log(`Aggregated ${devices.length} device(s), ${output.models.length} model(s), and ${output.days.length} active day(s).`);
