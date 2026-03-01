// ─────────────────────────────────────────
// BAR STYLES
// ─────────────────────────────────────────

const BAR_STYLES = {
  classic:  { filled: '▓', empty: '░', name: 'Классический' },
  diamond:  { filled: '◆', empty: '◇', name: 'Бриллиант' },
  dot:      { filled: '●', empty: '○', name: 'Точка' },
  line:     { filled: '━', empty: '─', name: 'Линия' },
};

function renderBar(percent, style, length) {
  length = length || 8;
  const cfg = BAR_STYLES[style] || BAR_STYLES.classic;
  const filled = Math.round((percent / 100) * length);
  const empty = length - filled;
  let bar = '';

  if (style === 'gradient') {
    for (let i = 0; i < filled; i++) {
      const ratio = i / length;
      bar += ratio < 0.4 ? '█' : ratio < 0.7 ? '▓' : '▒';
    }
    for (let i = 0; i < empty; i++) bar += '░';
  } else if (style === 'emoji') {
    const fc = percent < 50 ? '🟢' : percent < 80 ? '🟡' : '🔴';
    for (let i = 0; i < filled; i++) bar += fc;
    for (let i = 0; i < empty; i++) bar += '⚪';
  } else {
    for (let i = 0; i < filled; i++) bar += cfg.filled;
    for (let i = 0; i < empty; i++) bar += cfg.empty;
  }
  return bar;
}

// Colored bar for preview (filled portion changes color by percent)
function renderColoredBar(percent, style, length, fillColorOverride) {
  length = length || 8;
  const filled = Math.round((percent / 100) * length);
  const empty = length - filled;
  const fillColor = fillColorOverride || (percent < 50 ? '#4ec94e' : percent < 80 ? '#e8c44d' : '#e84d4d');
  const emptyColor = previewTheme === 'light' ? '#bbb' : '#444';

  if (style === 'emoji') {
    const fc = percent < 50 ? '🟢' : percent < 80 ? '🟡' : '🔴';
    return (fc.repeat(filled)) + ('⚪'.repeat(empty));
  }

  const cfg = BAR_STYLES[style] || BAR_STYLES.classic;
  let filledStr = '';
  if (style === 'gradient') {
    for (let i = 0; i < filled; i++) {
      const r = i / length;
      filledStr += r < 0.4 ? '█' : r < 0.7 ? '▓' : '▒';
    }
  } else {
    filledStr = cfg.filled.repeat(filled);
  }
  const emptyStr = cfg.empty.repeat(empty);

  return `<span style="letter-spacing:0;line-height:1;vertical-align:middle">`
       + (filledStr ? `<span style="color:${fillColor}">${filledStr}</span>` : '')
       + (emptyStr  ? `<span style="color:${emptyColor}">${emptyStr}</span>` : '')
       + `</span>`;
}
