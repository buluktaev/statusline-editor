// ─────────────────────────────────────────
// ANSI COLOR PICKER
// ─────────────────────────────────────────

function buildAnsiPalette(currentCode, onChange) {
  const wrap = document.createElement('div');
  wrap.className = 'color-picker-wrap';

  const previewRow = document.createElement('div');
  previewRow.className = 'color-preview-row';

  const swatch = document.createElement('div');
  swatch.className = 'color-swatch';
  swatch.style.background = ansiToCSS(currentCode);
  swatch.title = 'Нажмите чтобы открыть/закрыть палитру';

  const label = document.createElement('span');
  label.className = 'color-preview-text';
  label.textContent = `ANSI ${currentCode}`;

  previewRow.appendChild(swatch);
  previewRow.appendChild(label);
  wrap.appendChild(previewRow);

  const palette = document.createElement('div');
  palette.className = 'ansi-palette';

  function makeCell(code) {
    const cell = document.createElement('div');
    cell.className = 'ansi-cell' + (code === currentCode ? ' selected' : '');
    cell.style.background = ansiToCSS(code);
    cell.title = `ANSI ${code}`;
    cell.addEventListener('click', () => {
      onChange(code);
      palette.classList.remove('open');
    });
    return cell;
  }

  // Base 16 colors (2 rows of 8)
  const row1 = document.createElement('div'); row1.className = 'ansi-row';
  const row2 = document.createElement('div'); row2.className = 'ansi-row';
  for (let i = 0; i < 8; i++) row1.appendChild(makeCell(i));
  for (let i = 8; i < 16; i++) row2.appendChild(makeCell(i));
  palette.appendChild(row1);
  palette.appendChild(row2);

  // Spacer
  const s1 = document.createElement('div'); s1.style.height = '4px';
  palette.appendChild(s1);

  // 216 color cube
  for (let r = 0; r < 6; r++) {
    const row = document.createElement('div');
    row.className = 'ansi-row';
    for (let g = 0; g < 6; g++) {
      for (let b = 0; b < 6; b++) {
        row.appendChild(makeCell(16 + r * 36 + g * 6 + b));
      }
    }
    palette.appendChild(row);
  }

  // Spacer
  const s2 = document.createElement('div'); s2.style.height = '4px';
  palette.appendChild(s2);

  // Grayscale
  const grayRow = document.createElement('div'); grayRow.className = 'ansi-row';
  for (let i = 232; i < 256; i++) grayRow.appendChild(makeCell(i));
  palette.appendChild(grayRow);

  wrap.appendChild(palette);
  swatch.addEventListener('click', () => palette.classList.toggle('open'));
  return wrap;
}

function buildToggle(checked, label, onChange) {
  const wrap = document.createElement('div');
  wrap.className = 'toggle-wrap';
  wrap.innerHTML = `
    <label class="toggle">
      <input type="checkbox" ${checked ? 'checked' : ''}>
      <span class="toggle-slider"></span>
    </label>
    <span class="toggle-text">${label}</span>
  `;
  wrap.querySelector('input').addEventListener('change', (e) => onChange(e.target.checked));
  return wrap;
}

function buildSegment(options, current, onChange) {
  const seg = document.createElement('div');
  seg.className = 'segment';
  options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'segment-btn' + (opt.value == current ? ' active' : '');
    btn.textContent = opt.label;
    btn.addEventListener('click', () => onChange(opt.value));
    seg.appendChild(btn);
  });
  return seg;
}

function buildRow(label, content) {
  const row = document.createElement('div');
  row.className = 'setting-row';
  const lbl = document.createElement('div');
  lbl.className = 'setting-label';
  lbl.textContent = label;
  row.appendChild(lbl);
  row.appendChild(content);
  return row;
}

function buildCounter(value, min, max, onChange) {
  const wrap = document.createElement('div');
  wrap.className = 'space-counter';
  const minus = document.createElement('button');
  minus.className = 'counter-btn';
  minus.textContent = '−';
  const val = document.createElement('span');
  val.className = 'counter-val';
  val.textContent = value;
  const plus = document.createElement('button');
  plus.className = 'counter-btn';
  plus.textContent = '+';
  minus.addEventListener('click', () => {
    if (value > min) { value--; val.textContent = value; onChange(value); }
  });
  plus.addEventListener('click', () => {
    if (value < max) { value++; val.textContent = value; onChange(value); }
  });
  wrap.appendChild(minus);
  wrap.appendChild(val);
  wrap.appendChild(plus);
  return wrap;
}
