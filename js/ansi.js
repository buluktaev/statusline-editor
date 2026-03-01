// ─────────────────────────────────────────
// ANSI 256 COLOR UTILITIES
// ─────────────────────────────────────────

function ansiToCSS(n) {
  n = parseInt(n);
  if (n < 16) {
    const base = [
      '#000000','#800000','#008000','#808000',
      '#000080','#800080','#008080','#c0c0c0',
      '#808080','#ff0000','#00ff00','#ffff00',
      '#0000ff','#ff00ff','#00ffff','#ffffff'
    ];
    return base[n];
  }
  if (n >= 232) {
    const v = 8 + (n - 232) * 10;
    return `rgb(${v},${v},${v})`;
  }
  const idx = n - 16;
  const r = Math.floor(idx / 36);
  const g = Math.floor((idx % 36) / 6);
  const b = idx % 6;
  return `rgb(${r?r*40+55:0},${g?g*40+55:0},${b?b*40+55:0})`;
}

function ansiEscape(n) {
  return `\\033[38;5;${n}m`;
}
