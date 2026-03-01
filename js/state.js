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

const STORAGE_KEY = 'sle-state-v1';

// Load saved state or fall back to defaults
let state = (() => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && Array.isArray(saved.blocks) && saved.blocks.length > 0) return saved;
  } catch (e) {}
  return JSON.parse(JSON.stringify(DEFAULTS));
})();

// Migration: ensure all required fields exist
state.blocks.forEach(block => {
  if (block.id === 'directory' && !('showGit' in block)) block.showGit = true;
});

let selectedBlockId = state.blocks.find(b => b.enabled)?.id ?? 'rate5h';
let previewTheme = 'dark';

function saveState() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) {}
}

function resetState() {
  localStorage.removeItem(STORAGE_KEY);
  state = JSON.parse(JSON.stringify(DEFAULTS));
  selectedBlockId = 'rate5h';
  previewTheme = 'dark';
}

function isDirty() {
  return JSON.stringify(state) !== JSON.stringify(DEFAULTS);
}

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
