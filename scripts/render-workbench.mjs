import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const data = JSON.parse(readFileSync('data/usage.json', 'utf8'));
const embeddedFont = readFileSync('assets/workbench-font.css', 'utf8');
const total = data.models.reduce((sum, model) => sum + model.tokens, 0);
const totalSessions = data.sources.reduce((sum, source) => sum + source.sessions, 0);
const end = new Date(data.updatedAt || Date.now());
end.setUTCHours(0, 0, 0, 0);
const start = new Date(end);
start.setUTCDate(start.getUTCDate() - 364);
const observed = new Map(data.days.map((day) => [day.date, day]));
const days = [];

for (let index = 0; index < 365; index += 1) {
  const date = new Date(start);
  date.setUTCDate(start.getUTCDate() + index);
  const key = date.toISOString().slice(0, 10);
  const usage = observed.get(key) || { tokens: 0, sources: {} };
  days.push({
    index,
    date: key,
    weekday: date.getUTCDay(),
    tokens: Number(usage.tokens || 0),
    sources: usage.sources || {},
  });
}

const activeDays = days.filter((day) => day.tokens > 0).length;
let longestStreak = 0;
let currentStreak = 0;
for (const day of days) {
  currentStreak = day.tokens > 0 ? currentStreak + 1 : 0;
  longestStreak = Math.max(longestStreak, currentStreak);
}
const peak = days.reduce((best, day) => day.tokens > best.tokens ? day : best, days[0]);
const sourceTotals = new Map(data.sources.map((source) => [source.name, source]));

const themes = {
  dark: {
    background: '#0D1117', panel: '#161B22', panelAlt: '#0F141B', ink: '#E6EDF3', muted: '#8B949E', faint: '#656D76',
    stroke: '#30363D', grid: '#21262D', dormantTop: '#161B22', dormantRight: '#10151B', dormantLeft: '#0C1117',
    lowTop: '#0D419D', highTop: '#96CDFF', lowRight: '#0B3784', highRight: '#7EACD6', lowLeft: '#092E6E', highLeft: '#6990B2',
    accent: '#58A6FF', accentSoft: '#388BFD', claude: '#C4633F', codex: '#0FA3B1',
  },
  light: {
    background: '#FFFFFF', panel: '#F6F8FA', panelAlt: '#FFFFFF', ink: '#1F2328', muted: '#59636E', faint: '#818B98',
    stroke: '#D0D7DE', grid: '#D8DEE4', dormantTop: '#EBEFF3', dormantRight: '#DDE3E9', dormantLeft: '#D2D9E0',
    lowTop: '#B6D7FF', highTop: '#0969DA', lowRight: '#8FC2FF', highRight: '#0550AE', lowLeft: '#6EAEFA', highLeft: '#033D8B',
    accent: '#0969DA', accentSoft: '#218BFF', claude: '#A94E31', codex: '#087F8C',
  },
};

function compact(value) {
  const number = Number(value || 0);
  if (number >= 1e9) return `${(number / 1e9).toFixed(number >= 1e10 ? 1 : 2).replace(/\.0$/, '')}B`;
  if (number >= 1e6) return `${(number / 1e6).toFixed(number >= 1e8 ? 0 : 1).replace(/\.0$/, '')}M`;
  if (number >= 1e3) return `${(number / 1e3).toFixed(number >= 1e5 ? 0 : 1).replace(/\.0$/, '')}K`;
  return number.toLocaleString('en-US');
}

function safe(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;',
  })[character]);
}

function hex(value) {
  return value.match(/[a-f\d]{2}/gi).map((part) => Number.parseInt(part, 16));
}

function mix(from, to, amount) {
  const left = hex(from);
  const right = hex(to);
  return `#${left.map((value, index) => Math.round(value + (right[index] - value) * amount).toString(16).padStart(2, '0')).join('')}`;
}

function coords(day) {
  const firstWeekday = days[0].weekday;
  const week = Math.floor((firstWeekday + day.index) / 7);
  return {
    week,
    // The reference workbench uses this descending isometric calendar plane.
    x: 194 + week * 7.15 - day.weekday * 4.1,
    y: 157 + week * 4.15 + day.weekday * 2.35,
  };
}

function cube(theme, day, maxTokens) {
  const { x, y, week } = coords(day);
  const ratio = day.tokens ? day.tokens / maxTokens : 0;
  const intensity = Math.sqrt(ratio);
  const height = day.tokens ? 6 + Math.round(intensity * 38) : 2.6;
  const width = 5.2;
  const depth = 3;
  const topY = y - height;
  const top = day.tokens ? mix(theme.lowTop, theme.highTop, intensity) : theme.dormantTop;
  const right = day.tokens ? mix(theme.lowRight, theme.highRight, intensity) : theme.dormantRight;
  const left = day.tokens ? mix(theme.lowLeft, theme.highLeft, intensity) : theme.dormantLeft;
  return `<g class="cube" style="animation-delay:${(week * 18 + day.weekday * 4)}ms">
    <polygon points="${x},${topY} ${x + width},${topY + depth} ${x},${topY + depth * 2} ${x - width},${topY + depth}" fill="${top}"/>
    <polygon points="${x + width},${topY + depth} ${x + width},${y + depth} ${x},${y + depth * 2} ${x},${topY + depth * 2}" fill="${right}"/>
    <polygon points="${x},${topY + depth * 2} ${x},${y + depth * 2} ${x - width},${y + depth} ${x - width},${topY + depth}" fill="${left}"/>
  </g>`;
}

function calendar(theme) {
  const maxTokens = Math.max(1, ...days.map((day) => day.tokens));
  const cubes = [...days]
    .sort((a, b) => coords(a).y - coords(b).y || coords(a).x - coords(b).x)
    .map((day) => cube(theme, day, maxTokens))
    .join('');
  const labels = [];
  let month = -1;
  for (const day of days) {
    const date = new Date(`${day.date}T00:00:00Z`);
    if (date.getUTCMonth() === month) continue;
    month = date.getUTCMonth();
    const { week } = coords(day);
    const label = {
      week,
      text: date.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' }).toUpperCase(),
    };
    if (labels.length && week - labels.at(-1).week < 3) labels[labels.length - 1] = label;
    else labels.push(label);
  }
  let callout = '';
  if (peak?.tokens) {
    const { x, y } = coords(peak);
    const intensity = Math.sqrt(peak.tokens / maxTokens);
    const topY = y - 5 - Math.round(intensity * 24);
    callout = `<g class="callout"><line x1="${x}" y1="${topY - 2}" x2="${x}" y2="${topY - 22}" class="pin"/>
      <rect x="${x - 43}" y="${topY - 39}" width="86" height="18" rx="9" class="pill"/>
      <text x="${x}" y="${topY - 27}" text-anchor="middle" class="peak">${compact(peak.tokens)} / ${peak.date.slice(5)}</text></g>`;
  }
  const monthLabels = labels.map((label) => {
    const day = days.find((item) => Math.floor((days[0].weekday + item.index) / 7) === label.week);
    const position = day ? coords(day) : { x: 194 + label.week * 7.15, y: 157 + label.week * 4.15 };
    return `<text x="${position.x}" y="${position.y + 24}" class="month" text-anchor="end">${label.text}</text>`;
  }).join('');
  return `${cubes}${monthLabels}${callout}`;
}

function modelRows(theme) {
  const models = data.models.slice(0, 5);
  if (!models.length) return `<text x="42" y="528" class="empty">暂无本地使用数据</text>`;
  const max = Math.max(...models.map((model) => model.tokens), 1);
  return models.map((model, index) => {
    const y = 501 + index * 19;
    const sourceColor = model.source === 'claude' ? theme.claude : theme.codex;
    const cache = model.inputTokens ? model.cachedTokens / model.inputTokens * 100 : 0;
    const width = Math.max(3, Math.round(168 * model.tokens / max));
    return `<g class="model-row" style="animation-delay:${1200 + index * 90}ms">
      <circle cx="40" cy="${y - 4}" r="4.5" fill="${sourceColor}"/>
      <text x="52" y="${y}" class="model-name">${safe(model.name)}</text>
      <text x="404" y="${y}" class="model-num" text-anchor="end">${compact(model.tokens)}</text>
      <text x="492" y="${y}" class="model-num" text-anchor="end">${cache.toFixed(cache >= 10 ? 0 : 1)}%</text>
      <rect x="520" y="${y - 7}" width="168" height="6" rx="3" class="bar-track"/>
      <rect x="520" y="${y - 7}" width="${width}" height="6" rx="3" fill="${sourceColor}" class="bar"/>
      <text x="800" y="${y}" class="model-source" text-anchor="end">${model.source.toUpperCase()}</text>
    </g>`;
  }).join('');
}

function render(mode) {
  const theme = themes[mode];
  const updated = String(data.updatedAt || '').slice(0, 10) || 'SYNC PENDING';
  const codex = sourceTotals.get('codex') || { tokens: 0, sessions: 0 };
  const claude = sourceTotals.get('claude') || { tokens: 0, sessions: 0 };
  const label = `kyc001 vibe coding stats: ${compact(total)} tokens across ${activeDays} active days`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="840" height="608" viewBox="0 0 840 608" role="img" aria-label="${safe(label)}">
  <defs>
    <linearGradient id="canvas" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${theme.background}"/><stop offset="1" stop-color="${mode === 'dark' ? '#080C11' : '#F5F8FC'}"/></linearGradient>
    <linearGradient id="hero-gradient" x1="0" y1="0" x2="1" y2="0"><stop stop-color="${theme.accentSoft}"/><stop offset="1" stop-color="${theme.accent}"/></linearGradient>
    <linearGradient id="panel-glow" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${theme.accent}" stop-opacity=".42"/><stop offset=".45" stop-color="${theme.stroke}" stop-opacity=".08"/><stop offset="1" stop-color="${theme.stroke}" stop-opacity="0"/></linearGradient>
    <radialGradient id="terrain-glow" cx="70%" cy="78%" r="54%"><stop stop-color="${theme.accent}" stop-opacity="${mode === 'dark' ? '.13' : '.09'}"/><stop offset="1" stop-color="${theme.accent}" stop-opacity="0"/></radialGradient>
    <filter id="panel-shadow" x="-10%" y="-20%" width="120%" height="150%"><feDropShadow dx="0" dy="8" stdDeviation="9" flood-color="#000000" flood-opacity="${mode === 'dark' ? '.30' : '.10'}"/></filter>
    <filter id="soft-glow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="10"/></filter>
  </defs>
  <style>
    ${embeddedFont}
    text{font-family:'Segoe UI',Ubuntu,Helvetica,Arial,sans-serif;letter-spacing:0}
    .title{fill:${theme.ink};font-family:'JBMono','JetBrains Mono',ui-monospace,monospace;font-size:20px;font-weight:700;letter-spacing:1.4px}.subtitle{fill:${theme.muted};font-family:'JBMono','JetBrains Mono',ui-monospace,monospace;font-size:12px;font-weight:500}.hero{fill:url(#hero-gradient);font-family:'JBMono','JetBrains Mono',ui-monospace,monospace;font-size:40px;font-weight:700}.hero-unit{font-size:40px}.hero-label{fill:${theme.muted};font-size:12px;letter-spacing:.8px}.eyebrow{fill:${theme.muted};font-size:12px;letter-spacing:.8px}
    .panel{fill:${theme.panel};stroke:${theme.stroke};stroke-width:1}.pill{fill:${theme.panelAlt};stroke:${theme.stroke};stroke-width:1}.panel-label{fill:${theme.muted};font-size:13px;font-weight:600;letter-spacing:.8px}.stat{fill:${theme.ink};font-family:'JBMono','JetBrains Mono',ui-monospace,monospace;font-size:24px;font-weight:700}.stat-label{fill:${theme.muted};font-size:12px;font-weight:500;letter-spacing:.8px}
    .month{fill:${theme.faint};font-size:12px}.peak{fill:${theme.ink};font-family:'JBMono','JetBrains Mono',ui-monospace,monospace;font-size:13px;font-weight:500}.pin{stroke:${theme.muted};stroke-width:1.5;opacity:.9}.model-name{fill:${theme.ink};font-family:'JBMono','JetBrains Mono',ui-monospace,monospace;font-size:14px;font-weight:700}.model-num,.model-source{fill:${theme.muted};font-family:'JBMono','JetBrains Mono',ui-monospace,monospace;font-size:12px;font-weight:500}.bar-track{fill:${theme.grid}}.empty{fill:${theme.muted};font-size:12px}.divider{stroke:${theme.grid};stroke-width:1}
    .cube,.callout,.panel-in,.model-row,.bar{opacity:1}
  </style>
  <rect width="840" height="608" rx="8" fill="${theme.background}"/>
  <text x="24" y="50" class="title">VIBE CODING STATS</text>
  <circle cx="31" cy="66" r="5" fill="${theme.claude}"/><text x="43" y="71" class="subtitle">CLAUDE CODE</text>
  <text x="132" y="71" class="subtitle">x</text>
  <circle cx="153" cy="66" r="5" fill="${theme.codex}"/><text x="166" y="71" class="subtitle">CODEX CLI · @kyc001</text>
  <text x="816" y="54" class="hero" text-anchor="end">${compact(total)} tokens</text>
  <text x="816" y="74" class="hero-label" text-anchor="end">累计用量 · ${updated}</text>
  <g>${calendar(theme)}</g>

  <g class="panel-in"><rect x="480.5" y="96.5" width="335" height="91" rx="10" class="panel"/><rect x="481.5" y="97.5" width="333" height="89" rx="9" fill="none" stroke="url(#panel-glow)"/>
    <text x="500" y="136" class="stat">${activeDays}天</text><text x="500" y="158" class="stat-label">活跃天数</text>
    <text x="608" y="136" class="stat">${longestStreak}天</text><text x="608" y="158" class="stat-label">最长连续</text>
    <text x="718" y="136" class="stat">${totalSessions.toLocaleString('en-US')}</text><text x="718" y="158" class="stat-label">会话总数</text>
  </g>

  <g class="panel-in"><rect x="24.5" y="350.5" width="315" height="91" rx="10" class="panel"/><rect x="25.5" y="351.5" width="313" height="89" rx="9" fill="none" stroke="url(#panel-glow)"/>
    <text x="42" y="389" class="stat" fill="${theme.claude}">${compact(claude.tokens)}</text><text x="42" y="412" class="stat-label">CLAUDE</text>
    <text x="143" y="389" class="stat" fill="${theme.codex}">${compact(codex.tokens)}</text><text x="143" y="412" class="stat-label">CODEX</text>
    <text x="242" y="389" class="stat">${compact(peak?.tokens || 0)}</text><text x="242" y="412" class="stat-label">单日峰值</text>
  </g>
  <g><rect x="24.5" y="454.5" width="791" height="139" rx="12" class="panel"/><rect x="25.5" y="455.5" width="789" height="137" rx="11" fill="none" stroke="url(#panel-glow)"/></g>
  <text x="40" y="480" class="panel-label">热门模型</text>
  <text x="404" y="480" class="hero-label" text-anchor="end">TOKENS</text><text x="492" y="480" class="hero-label" text-anchor="end">缓存</text><text x="520" y="480" class="hero-label">相对用量</text><text x="800" y="480" class="hero-label" text-anchor="end">来源</text>
  <line x1="40" y1="488" x2="800" y2="488" class="divider"/>
  ${modelRows(theme)}
  <text x="24" y="602" class="eyebrow">365 天 / ${data.devices.length} 台设备 / 本地聚合 / 实时 SVG</text>
  <text x="816" y="602" class="eyebrow" text-anchor="end">KYC001</text>
  </svg>`;
}

mkdirSync('assets', { recursive: true });
for (const mode of ['dark', 'light']) {
  writeFileSync(`assets/ai-workbench-${mode}.svg`, render(mode).replace(/[ \t]+$/gm, ''));
}
console.log(`Rendered kyc001 AI workbench: ${compact(total)} tokens, ${activeDays} active days, ${totalSessions} sessions.`);
