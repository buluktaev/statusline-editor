// ─────────────────────────────────────────
// PREVIEW RENDERER
// ─────────────────────────────────────────

function getContextColor(percent) {
  const block = state.blocks.find(b => b.id === 'context');
  if (!block) return '#4ec94e';
  for (const t of block.thresholds) {
    if (percent <= t.max) return ansiToCSS(t.color);
  }
  return ansiToCSS(block.thresholds[block.thresholds.length - 1].color);
}

function formatTokens(n, fmt) {
  if (fmt === '1000') return n.toString();
  if (fmt === '1.2k') return (n / 1000).toFixed(1) + 'k';
  return Math.floor(n / 1000) + 'k';
}

function renderPreview() {
  const preview = document.getElementById('preview');
  const parts = [];

  const isDark = previewTheme === 'dark';
  const sepColor = isDark ? '#555' : '#aaa';
  const sepUserColor = ansiToCSS(state.globalSepColor);
  const sep = (ch) => `<span style="color:${sepUserColor}">&nbsp;${ch}&nbsp;</span>`;
  const spaces = (n) => n > 0 ? '&nbsp;'.repeat(n) : '';

  let isFirst = true;
  for (const block of state.blocks) {
    if (!block.enabled) continue;

    if (!isFirst) parts.push(state.globalSepEnabled && state.globalSep ? sep(state.globalSep) : '&nbsp;');
    isFirst = false;

    switch (block.id) {
      case 'model':
        parts.push(`<span style="color:${ansiToCSS(block.color)}">[${MOCK.model}]</span>`);
        break;
      case 'context': {
        let html = `<span style="color:${getContextColor(MOCK.contextPercent)}"> c${MOCK.contextPercent}%</span>`;
        if (block.showContextTokens) {
          const usedTokens = Math.round(MOCK.contextMaxTokens * MOCK.contextPercent / 100 / 1000) + 'K';
          const maxTokens = Math.round(MOCK.contextMaxTokens / 1000) + 'K';
          html += `&nbsp;<span style="color:${ansiToCSS(block.contextTokensColor)}">(${usedTokens}/${maxTokens})</span>`;
        }
        parts.push(html);
        break;
      }
      case 'rate5h': {
        const rateColor = ansiToCSS(block.color);
        let s = '';
        if (block.showBar) {
          const bar = renderColoredBar(MOCK.rate5hPercent, block.style, 8, rateColor);
          s += bar + '&nbsp;';
        }
        s += `<span style="color:${rateColor}">h${MOCK.rate5hPercent}%</span>`;
        if (block.showReset) s += `&nbsp;<span style="color:${ansiToCSS(block.colorReset ?? 238)}">${MOCK.rate5hReset}</span>`;
        parts.push(s);
        break;
      }
      case 'rateWeek': {
        const rateColor = ansiToCSS(block.color);
        let s = '';
        if (block.showBar) {
          const bar = renderColoredBar(MOCK.rateWeekPercent, block.style, 8, rateColor);
          s += bar + '&nbsp;';
        }
        s += `<span style="color:${rateColor}">w${MOCK.rateWeekPercent}%</span>`;
        if (block.showReset) s += `&nbsp;<span style="color:${ansiToCSS(block.colorReset ?? 238)}">${MOCK.rateWeekReset}</span>`;
        parts.push(s);
        break;
      }
      case 'tokens':
        parts.push(`<span style="color:${ansiToCSS(block.color)}">↑${formatTokens(MOCK.inputTokens, block.format)} ↓${formatTokens(MOCK.outputTokens, block.format)}</span>`);
        break;
      case 'directory': {
        let dirHtml = `<span style="color:${ansiToCSS(block.color)}">${MOCK.cwd}</span>`;
        if (block.showGit ?? true) {
          const branchColor = ansiToCSS(block.colorBranch);
          const statusColor = MOCK.gitStatus === 'clean' ? ansiToCSS(block.colorClean) : ansiToCSS(block.colorDirty);
          dirHtml += ` <span style="color:${branchColor}">(${MOCK.gitBranch})</span>`;
        }
        parts.push(dirHtml);
        break;
      }
    }
  }

  preview.innerHTML = parts.join('');
}
