// ─────────────────────────────────────────
// BLOCKS PANEL
// ─────────────────────────────────────────

let dragSrcIdx = null;

function renderBlocks() {
  const list = document.getElementById('blocks-list');
  list.innerHTML = '';

  state.blocks.forEach((block, idx) => {
    const item = document.createElement('div');
    item.className = 'block-item' +
      (block.id === selectedBlockId ? ' active' : '') +
      (!block.enabled ? ' disabled' : '');
    item.draggable = true;
    item.dataset.idx = idx;

    item.innerHTML = `
      <span class="drag-handle" title="Перетащить">⠿</span>
      <span class="block-toggle ${block.enabled ? 'on' : ''}" data-id="${block.id}">
        ${block.enabled ? '✓' : ''}
      </span>
      <span class="block-name">${block.name}</span>
    `;

    // Клик по элементу — выбор для настройки
    item.addEventListener('click', (e) => {
      if (e.target.classList.contains('block-toggle')) return;
      selectedBlockId = block.id;
      render();
setTheme(previewTheme);  // Initialize theme icon
    });

    // Клик по toggle — вкл/выкл
    item.querySelector('.block-toggle').addEventListener('click', (e) => {
      e.stopPropagation();
      block.enabled = !block.enabled;
      render();
    });

    // Drag & Drop
    item.addEventListener('dragstart', (e) => {
      dragSrcIdx = idx;
      e.dataTransfer.effectAllowed = 'move';
      setTimeout(() => item.style.opacity = '0.5', 0);
    });
    item.addEventListener('dragend', () => {
      item.style.opacity = '';
      document.querySelectorAll('.block-item').forEach(el => el.classList.remove('drag-over'));
    });
    item.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      document.querySelectorAll('.block-item').forEach(el => el.classList.remove('drag-over'));
      item.classList.add('drag-over');
    });
    item.addEventListener('dragleave', () => item.classList.remove('drag-over'));
    item.addEventListener('drop', (e) => {
      e.preventDefault();
      item.classList.remove('drag-over');
      if (dragSrcIdx === null || dragSrcIdx === idx) return;
      const moved = state.blocks.splice(dragSrcIdx, 1)[0];
      state.blocks.splice(idx, 0, moved);
      dragSrcIdx = null;
      render();
    });

    list.appendChild(item);
  });

  const sepDivider = document.createElement('div');
  sepDivider.style.cssText = 'height:1px;background:var(--border);margin:6px 0 2px';
  list.appendChild(sepDivider);

  const sepItem = document.createElement('div');
  sepItem.className = 'block-item' + (selectedBlockId === '_sep' ? ' active' : '');
  sepItem.innerHTML = `
    <span class="block-toggle ${state.globalSepEnabled ? 'on' : ''}" data-id="_sep">
      ${state.globalSepEnabled ? '✓' : ''}
    </span>
    <span class="block-name">Разделитель</span>
  `;

  sepItem.addEventListener('click', (e) => {
    if (e.target.classList.contains('block-toggle')) return;
    selectedBlockId = '_sep';
    render();
  });

  sepItem.querySelector('.block-toggle').addEventListener('click', (e) => {
    e.stopPropagation();
    state.globalSepEnabled = !state.globalSepEnabled;
    render();
  });

  list.appendChild(sepItem);
}
