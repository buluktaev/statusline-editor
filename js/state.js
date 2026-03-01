// ─────────────────────────────────────────
// STATE
// ─────────────────────────────────────────

const DEFAULTS = {
  globalSep: '|',
  globalSepEnabled: true,
  globalSepColor: 243,
  blocks: [
    { id: 'model', name: 'Model', enabled: true, color: 254 },
    { id: 'rate5h', name: 'Rate 5h', enabled: true, style: 'classic', showReset: true, showBar: true, color: 249, colorReset: 238 },
    { id: 'rateWeek', name: 'Rate Week', enabled: true, style: 'classic', showReset: false, showBar: true, color: 249, colorReset: 238 },
    {
      id: 'context', name: 'Context %', enabled: true, showContextTokens: true, contextTokensColor: 243,
      thresholds: [
        { max: 50, color: 82 },
        { max: 80, color: 226 },
        { max: 100, color: 203 },
      ],
    },
    { id: 'tokens', name: 'Tokens', enabled: true, format: '1k', color: 245 },
    { id: 'directory', name: 'Directory', enabled: true, color: 247, depth: 2, showGit: true, colorBranch: 254 },
  ]
};

let state = JSON.parse(JSON.stringify(DEFAULTS));

// Ensure all blocks have required properties
state.blocks.forEach(block => {
  if (block.id === 'directory') {
    if (!('showGit' in block)) block.showGit = true;
  }
});
let selectedBlockId = 'rate5h';
let previewTheme = 'dark';

const MOCK = {
  model: 'Sonnet 4.6',
  contextPercent: 30,
  contextMaxTokens: 200000,
  rate5hPercent: 68,
  rate5hReset: '2h14m',
  rateWeekPercent: 42,
  rateWeekReset: '4d3h',
  inputTokens: 12400,
  outputTokens: 3100,
  cwd: '~/proj/app',
  gitBranch: 'main',
  gitStatus: 'dirty',
  gitAdded: 2,
  gitModified: 1,
  gitUntracked: 0,
};
