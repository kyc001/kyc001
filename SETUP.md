# AI Workbench

The profile workbench aggregates local usage from Codex and Claude Code. It publishes totals by day, model, source, and device; it does not publish prompts, responses, project paths, session IDs, API keys, account credentials, or machine hostnames.

## Data flow

```text
~/.codex/sessions/**/*.jsonl ----+
                                  +--> device aggregate --> GitHub --> SVG
~/.claude/projects/**/*.jsonl ---+
```

Codex cumulative counters are converted to per-event deltas. Claude Code streaming records are deduplicated by message ID and only the largest final usage record is counted. Claude totals include input, cache creation, cache read, and output tokens. Synthetic Claude messages are excluded.

## First sync

From a clone of `kyc001/kyc001`, use Node.js 20 or newer:

```powershell
$env:AI_WORKBENCH_DEVICE = 'windows'
npm run collect
npm run build
```

Inspect the generated public snapshot before publishing:

```powershell
Get-Content data/devices/windows.json
git diff -- data assets
```

To collect, commit, and push the latest device snapshot:

```powershell
$env:HTTP_PROXY = 'http://127.0.0.1:7897'
$env:HTTPS_PROXY = 'http://127.0.0.1:7897'
npm run sync
```

The GitHub workflow merges all device snapshots and regenerates both SVG themes. Use a stable, unique `AI_WORKBENCH_DEVICE` value on every computer to avoid duplicate totals.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run collect` | Read local Codex and Claude Code ledgers and write one device snapshot. |
| `npm run aggregate` | Merge all public device snapshots into `data/usage.json`. |
| `npm run render` | Generate the dark and light SVG cards. |
| `npm run build` | Aggregate and render locally. |
| `npm run sync` | Pull, collect, commit, and push the current device snapshot. |
