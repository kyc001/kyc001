import { readFileSync, writeFileSync } from 'node:fs';

const data = JSON.parse(readFileSync('data/usage.json', 'utf8'));
const HANDLE = 'kyc001';
const ZH = 'zh,zh-CN,zh-Hans,zh-TW,zh-HK,zh-Hant,zh-SG';
const TEMPLATE_REVISION = 'f6999a69ec8a5d7826031b3e8b1a7492cfac03ca';
const observed = [...data.days].sort((a, b) => a.date.localeCompare(b.date));
const end = new Date(data.updatedAt || observed.at(-1)?.date || Date.now());
end.setUTCHours(0, 0, 0, 0);
const firstObserved = new Date(`${observed[0]?.date || end.toISOString().slice(0, 10)}T00:00:00Z`);
const firstMonth = new Date(Date.UTC(firstObserved.getUTCFullYear(), firstObserved.getUTCMonth(), 1));
const start = new Date(firstMonth);
start.setUTCDate(start.getUTCDate() - start.getUTCDay());

const observedByDate = new Map(observed.map((day) => [day.date, day]));
const days = [];
for (let date = new Date(start), index = 0; date <= end; date.setUTCDate(date.getUTCDate() + 1), index += 1) {
  const key = date.toISOString().slice(0, 10);
  const usage = observedByDate.get(key) || { tokens: 0, sources: {} };
  days.push({
    index,
    date: key,
    weekday: date.getUTCDay(),
    tokens: Number(usage.tokens || 0),
  });
}

const sources = new Map(data.sources.map((source) => [source.name, source]));
const codex = sources.get('codex') || { tokens: 0, sessions: 0 };
const claude = sources.get('claude') || { tokens: 0, sessions: 0 };
const total = data.models.reduce((sum, model) => sum + Number(model.tokens || 0), 0);
const sessions = data.sources.reduce((sum, source) => sum + Number(source.sessions || 0), 0);
const activeDays = days.filter((day) => day.tokens > 0).length;
let streak = 0;
let longestStreak = 0;
for (const day of days) {
  streak = day.tokens > 0 ? streak + 1 : 0;
  longestStreak = Math.max(longestStreak, streak);
}
const peak = days.reduce((best, day) => day.tokens > best.tokens ? day : best, days[0]);

function compact(value) {
  const number = Number(value || 0);
  if (number >= 1e9) return `${(number / 1e9).toFixed(number >= 1e10 ? 1 : 2).replace(/0+$/, '').replace(/\.$/, '')}B`;
  if (number >= 1e6) return `${(number / 1e6).toFixed(number >= 1e8 ? 0 : 1).replace(/\.0$/, '')}M`;
  if (number >= 1e3) return `${(number / 1e3).toFixed(number >= 1e5 ? 0 : 1).replace(/\.0$/, '')}K`;
  return number.toLocaleString('en-US');
}

function safe(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;',
  })[character]);
}

function position(day) {
  const week = Math.floor(day.index / 7);
  return {
    week,
    x: 262.4 + (week - day.weekday) * 11.25,
    y: 140 + (week + day.weekday) * 6.5,
  };
}

function terrain() {
  const maxTokens = Math.max(1, ...days.map((day) => day.tokens));
  const cubes = [...days]
    .sort((left, right) => position(left).y - position(right).y || position(left).x - position(right).x)
    .map((day) => {
      const { week, x, y } = position(day);
      const width = 9.55;
      const depth = 5.5;
      if (!day.tokens) {
        return `    <g class="fd w${week}"><polygon points="${x},${y - depth} ${x + width},${y} ${x},${y + depth} ${x - width},${y}" class="t0"/></g>`;
      }
      const intensity = Math.sqrt(day.tokens / maxTokens);
      const level = Math.min(5, Math.max(1, Math.ceil(intensity * 5)));
      const height = 6 + Math.round(intensity * 30);
      const top = y - height;
      return `    <g class="cb w${week}"><polygon points="${x},${top - depth} ${x + width},${top} ${x},${top + depth} ${x - width},${top}" class="t${level}"/><polygon points="${x + width},${top} ${x + width},${y} ${x},${y + depth} ${x},${top + depth}" class="r${level}"/><polygon points="${x},${top + depth} ${x},${y + depth} ${x - width},${y} ${x - width},${top}" class="l${level}"/></g>`;
    })
    .join('\n');

  const monthNames = [];
  let previousMonth = -1;
  for (const day of days) {
    const date = new Date(`${day.date}T00:00:00Z`);
    if (date < firstMonth) continue;
    if (date.getUTCMonth() === previousMonth) continue;
    previousMonth = date.getUTCMonth();
    monthNames.push({
      zh: `${date.getUTCMonth() + 1}月`,
      en: date.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' }),
    });
  }
  const months = monthNames.map((month, index) => {
    const ratio = monthNames.length === 1 ? 0 : index / (monthNames.length - 1);
    const x = 207.4 + ratio * 349;
    const y = 212.5 + ratio * 201.5;
    return `    <switch><text x="${x.toFixed(1)}" y="${y.toFixed(1)}" class="axis" text-anchor="end" systemLanguage="${ZH}">${month.zh}</text><text x="${x.toFixed(1)}" y="${y.toFixed(1)}" class="axis" text-anchor="end">${month.en}</text></switch>`;
  }).join('\n');

  let beacon = '';
  if (peak?.tokens) {
    const { x, y } = position(peak);
    const intensity = Math.sqrt(peak.tokens / maxTokens);
    const top = y - 6 - Math.round(intensity * 30) - 5.5;
    const pillY = Math.max(92, top - 80);
    const zhDate = `${Number(peak.date.slice(5, 7))}月${Number(peak.date.slice(8, 10))}日`;
    const enDate = new Date(`${peak.date}T00:00:00Z`).toLocaleString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }).toUpperCase();
    beacon = `    <g class="beacon"><rect x="${x - 1}" y="${pillY + 21}" width="2" height="${Math.max(10, top - pillY - 21)}" fill="url(#beam)" class="beam"/><switch><g systemLanguage="${ZH}"><rect x="${x - 59}" y="${pillY}" width="118" height="21" rx="10.5" class="peak-pill"/><text x="${x}" y="${pillY + 15}" class="peak" text-anchor="middle">${compact(peak.tokens)} · ${zhDate}</text></g><g><rect x="${x - 57.7}" y="${pillY}" width="115.4" height="21" rx="10.5" class="peak-pill"/><text x="${x}" y="${pillY + 15}" class="peak" text-anchor="middle">${compact(peak.tokens)} · ${enDate}</text></g></switch></g>`;
  }

  return `  <g class="terrain-in">\n${months}\n${cubes}\n${beacon}
    <switch><text x="668" y="439.5" class="axis" text-anchor="end" systemLanguage="${ZH}">少</text><text x="668" y="439.5" class="axis" text-anchor="end">Less</text></switch>
    <rect x="676" y="431.5" width="100" height="8" rx="4" fill="url(#gradeRamp)"/>
    <switch><text x="784" y="439.5" class="axis" systemLanguage="${ZH}">多</text><text x="784" y="439.5" class="axis">More</text></switch>
  </g>\n`;
}

function switchLabel(x, y, className, zh, en, anchor = '') {
  const textAnchor = anchor ? ` text-anchor="${anchor}"` : '';
  return `<switch><text x="${x}" y="${y}" class="${className}"${textAnchor} systemLanguage="${ZH}">${zh}</text><text x="${x}" y="${y}" class="${className}"${textAnchor}>${en}</text></switch>`;
}

function extractIcon(svg, row) {
  const line = svg.match(new RegExp(`^  <g class="mrow ${row}">.*$`, 'm'))?.[0] || '';
  return line.match(/<g class="micon".*?<\/g>/)?.[0] || '';
}

async function loadTemplate(mode) {
  const templateUrl = `https://raw.githubusercontent.com/PekingSpades/PekingSpades/${TEMPLATE_REVISION}/assets/vibe-coding-${mode}.svg`;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(templateUrl);
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      return (await response.text()).replace('@PekingSpades', '@{{HANDLE}}');
    } catch (error) {
      if (attempt === 3) throw new Error(`Unable to download workbench template after 3 attempts: ${error.message}`);
      await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
    }
  }
  throw new Error('Unable to download workbench template.');
}

async function render(mode) {
  let svg = await loadTemplate(mode);
  const claudeIcon = extractIcon(svg, 'mr0');
  const codexIcon = extractIcon(svg, 'mr2');
  const totalLabel = `${compact(total)} tokens`;

  svg = svg.replace('{{HANDLE}}', HANDLE);
  svg = svg.replace(/aria-label="[^"]*"/, `aria-label="Vibe coding stats: ${compact(total)} tokens across ${activeDays} active days"`);
  svg = svg.split('61.7B tokens').join(totalLabel);

  const terrainStart = svg.indexOf('  <g class="terrain-in">');
  const tileStart = svg.indexOf('  <g class="tile ti0">');
  if (terrainStart < 0 || tileStart < 0) throw new Error('Template terrain markers not found.');
  svg = `${svg.slice(0, terrainStart)}${terrain()}${svg.slice(tileStart)}`;

  const tile0 = `  <g class="tile ti0"><rect x="480.5" y="96.5" width="335" height="91" rx="10" class="panel"/><rect x="481.5" y="97.5" width="333" height="89" rx="9" fill="none" stroke="url(#topGlow)" stroke-width="1"/><text x="498" y="136" class="stat-value">${compact(claude.tokens)}</text>${switchLabel(498, 158, 'tile-label', 'CLAUDE', 'CLAUDE')}<text x="604" y="136" class="stat-value">${compact(codex.tokens)}</text>${switchLabel(604, 158, 'tile-label', 'CODEX', 'CODEX')}<text x="710" y="136" class="stat-value">${activeDays}d</text>${switchLabel(710, 158, 'tile-label', '活跃天数', 'ACTIVE DAYS')}</g>`;
  const tile1 = `  <g class="tile ti1"><rect x="24.5" y="350.5" width="315" height="91" rx="10" class="panel"/><rect x="25.5" y="351.5" width="313" height="89" rx="9" fill="none" stroke="url(#topGlow)" stroke-width="1"/><text x="42" y="390" class="stat-value">${longestStreak}d</text>${switchLabel(42, 412, 'tile-label', '最长连续', 'LONGEST STREAK')}<text x="218" y="390" class="stat-value">${sessions.toLocaleString('en-US')}</text>${switchLabel(218, 412, 'tile-label', '会话总数', 'SESSIONS')}</g>`;
  svg = svg.replace(/^  <g class="tile ti0">.*$/m, tile0);
  svg = svg.replace(/^  <g class="tile ti1">.*$/m, tile1);

  const models = data.models.slice(0, 5);
  const maxModelTokens = Math.max(1, ...models.map((model) => model.tokens));
  const header = `  <g class="mrow mrh">${switchLabel(40, 478, 'panel-label', '热门模型', 'TOP MODELS')}<text x="400" y="478" class="axis" text-anchor="end">TOKENS</text>${switchLabel(490, 478, 'axis', '缓存', 'CACHE', 'end')}${switchLabel(520, 478, 'axis', '相对用量', 'VOLUME')}${switchLabel(800, 478, 'axis', '来源', 'SOURCE', 'end')}</g>`;
  svg = svg.replace(/^  <g class="mrow mrh">.*$/m, header);

  for (let index = 0; index < 5; index += 1) {
    const model = models[index];
    const y = 500 + index * 20;
    let row = '';
    if (model) {
      const baseIcon = model.source === 'claude' ? claudeIcon : codexIcon;
      const icon = baseIcon.replace(/translate\(36,\d+\)/, `translate(36,${487 + index * 20})`);
      const cache = model.inputTokens ? model.cachedTokens / model.inputTokens * 100 : 0;
      const barWidth = Math.max(5, 180 * model.tokens / maxModelTokens);
      row = `  <g class="mrow mr${index}">${icon}<text x="60" y="${y}" class="model-name">${safe(model.name)}</text><text x="400" y="${y}" class="model-num" text-anchor="end">${compact(model.tokens)}</text><text x="490" y="${y}" class="model-num" text-anchor="end">${cache.toFixed(cache >= 10 ? 0 : 1)}%</text><rect x="520" y="${y - 10}" width="${barWidth.toFixed(1)}" height="7" rx="3.5" class="cost-bar cbar${index}"/><text x="800" y="${y}" class="model-cost" text-anchor="end">${model.source.toUpperCase()}</text></g>`;
    }
    svg = svg.replace(new RegExp(`^  <g class="mrow mr${index}">.*$`, 'm'), row);
  }

  return svg;
}

for (const mode of ['dark', 'light']) {
  writeFileSync(`assets/ai-workbench-${mode}.svg`, await render(mode));
}

console.log(`Rendered vibe coding template for ${HANDLE}: ${compact(total)} tokens, ${activeDays} active days, ${sessions} sessions.`);
