// ─────────────────────────────────────────
// SETTINGS PANEL
// ─────────────────────────────────────────

const SEP_OPTIONS = [{value:'|',label:'|'},{value:'·',label:'·'},{value:'—',label:'—'},{value:'',label:'нет'}];

function renderSettings() {
  const content = document.getElementById('settings-content');
  if (!content) return;

  if (selectedBlockId === '_sep') {
    content.innerHTML = `<div class="settings-title">Разделитель</div>`;
    content.appendChild(buildRow('Стиль',
      buildSegment(SEP_OPTIONS, state.globalSep, v => { state.globalSep = v; render(); })
    ));
    content.appendChild(buildRow('Цвет',
      buildAnsiPalette(state.globalSepColor, v => { state.globalSepColor = v; render(); })
    ));
    return;
  }

  const block = state.blocks.find(b => b.id === selectedBlockId);

  if (!block) {
    content.innerHTML = '<div style="color: var(--text-dim); font-size: 12px;">← Выберите блок для настройки</div>';
    return;
  }

  content.innerHTML = `<div class="settings-title">${block.name}</div>`;

  switch (block.id) {
    case 'model':      renderModelSettings(content, block); break;
    case 'context':    renderContextSettings(content, block); break;
    case 'rate5h':
    case 'rateWeek':   renderRateSettings(content, block); break;
    case 'tokens':     renderTokensSettings(content, block); break;
    case 'directory':  renderDirectorySettings(content, block); break;
  }
}

function renderModelSettings(el, block) {
  el.appendChild(buildRow('Цвет текста',
    buildAnsiPalette(block.color, v => { block.color = v; render();
  })
  ));
}

function renderContextSettings(el, block) {
  const section = document.createElement('div');
  section.className = 'setting-row';
  const sectionLabel = document.createElement('div');
  sectionLabel.className = 'setting-label';
  sectionLabel.textContent = 'Цвета по порогам';
  section.appendChild(sectionLabel);

  const labels = ['0 – 49%', '50 – 79%', '80 – 100%'];
  block.thresholds.forEach((t, i) => {
    const row = document.createElement('div');
    row.className = 'threshold-row';
    const lbl = document.createElement('span');
    lbl.className = 'threshold-label';
    lbl.textContent = labels[i];
    row.appendChild(lbl);
    row.appendChild(buildAnsiPalette(t.color, v => { t.color = v; render();
  }));
    section.appendChild(row);
  });
  el.appendChild(section);

  const spacer1 = document.createElement('div');
  spacer1.style.height = '8px';
  el.appendChild(spacer1);

  el.appendChild(buildRow('Показывать (K/K)',
    buildToggle(block.showContextTokens, 'Размер контекста', v => { block.showContextTokens = v; render();
  })
  ));

  if (block.showContextTokens) {
    el.appendChild(buildRow('Цвет (K/K)',
      buildAnsiPalette(block.contextTokensColor, v => { block.contextTokensColor = v; render();
  })
    ));
  }
}

function renderRateSettings(el, block) {
  el.appendChild(buildRow('Цвет %',
    buildAnsiPalette(block.color, v => { block.color = v; render();
  })
  ));

  const divider1 = document.createElement('div');
  divider1.style.cssText = 'height:1px;background:var(--border);margin:2px 0';
  el.appendChild(divider1);

  el.appendChild(buildRow('Показывать шкалу',
    buildToggle(block.showBar, 'Шкала процентов', v => { block.showBar = v; render();
  })
  ));

  if (block.showBar) {
    const cardsRow = document.createElement('div');
    cardsRow.className = 'setting-row';
    const cardsLabel = document.createElement('div');
    cardsLabel.className = 'setting-label';
    cardsLabel.textContent = 'Стиль шкалы';
    cardsRow.appendChild(cardsLabel);

    const cards = document.createElement('div');
    cards.className = 'style-cards';
    Object.entries(BAR_STYLES).forEach(([key, cfg]) => {
      const card = document.createElement('div');
      card.className = 'style-card' + (block.style === key ? ' active' : '');
      const preview = renderBar(60, key, 6);
      card.innerHTML = `<div class="style-card-preview">${preview}</div><div class="style-card-name">${cfg.name}</div>`;
      card.addEventListener('click', () => { block.style = key; render();
    });
      cards.appendChild(card);
    });
    cardsRow.appendChild(cards);
    el.appendChild(cardsRow);

    el.appendChild(buildRow('Цвет шкалы',
      buildAnsiPalette(block.color, v => { block.color = v; render();
    })
    ));
  }

  const divider2 = document.createElement('div');
  divider2.style.cssText = 'height:1px;background:var(--border);margin:2px 0';
  el.appendChild(divider2);

  el.appendChild(buildRow('Показывать "до сброса"',
    buildToggle(block.showReset, 'Время до сброса', v => { block.showReset = v; render();
  })
  ));
  if (block.showReset) {
    el.appendChild(buildRow('Цвет таймера',
      buildAnsiPalette(block.colorReset ?? 238, v => { block.colorReset = v; render();
  })
    ));
  }
}

function renderTokensSettings(el, block) {
  el.appendChild(buildRow('Формат числа',
    buildSegment(
      [{value:'1k',label:'12k'},{value:'1.2k',label:'12.4k'},{value:'1000',label:'12400'}],
      block.format,
      v => { block.format = v; render();
}
    )
  ));
  el.appendChild(buildRow('Цвет',
    buildAnsiPalette(block.color, v => { block.color = v; render();
  })
  ));
}

function renderDirectorySettings(el, block) {
  el.appendChild(buildRow('Глубина пути',
    buildSegment(
      [{value:1,label:'app'},{value:2,label:'proj/app'},{value:0,label:'полный'}],
      block.depth,
      v => { block.depth = parseInt(v); render();
}
    )
  ));
  el.appendChild(buildRow('Цвет',
    buildAnsiPalette(block.color, v => { block.color = v; render();
  })
  ));

  // Git section
  const gitDiv = document.createElement('div');
  gitDiv.style.cssText = 'height:1px;background:var(--border);margin:8px 0 2px';
  el.appendChild(gitDiv);

  el.appendChild(buildRow('Git',
    buildToggle(block.showGit ?? true, 'Git', v => { block.showGit = v; render();
  })
  ));

  if (block.showGit ?? true) {
    el.appendChild(buildRow('Цвет ветки',
      buildAnsiPalette(block.colorBranch, v => { block.colorBranch = v; render();
  })
    ));


  }
}
