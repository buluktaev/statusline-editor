# Modular Structure Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Разделить монолитный `statusline-editor.html` (1480 строк) на модульную структуру: HTML + 4 CSS-файла + 10 JS-файлов.

**Architecture:** Чистый HTML/CSS/JS без сборщиков. `index.html` подключает все файлы через `<link>` и `<script src>`. Файлы-модули самодостаточны: каждый объявляет свои функции/переменные в глобальном скоупе (без ES modules — браузер открывает файл через `file://`). Порядок подключения в `index.html` строго соблюдается из-за зависимостей.

**Tech Stack:** Vanilla HTML/CSS/JS, без npm, без сборщиков.

---

## Итоговая структура файлов

```
statusline-editor/
├── index.html
├── styles/
│   ├── variables.css     (CSS custom properties :root)
│   ├── layout.css        (body, #app, #editor, panels, #output)
│   ├── components.css    (btn, toggle, segment, color-picker, counter)
│   └── terminal.css      (term-window, titlebar, light-mode)
└── js/
    ├── ansi.js           (ansiToCSS, ansiEscape)
    ├── state.js          (DEFAULTS, state, MOCK, selectedBlockId, previewTheme)
    ├── bars.js           (BAR_STYLES, renderBar, renderColoredBar)
    ├── theme.js          (toggleTheme, setTheme)
    ├── preview.js        (renderPreview, getContextColor, formatTokens)
    ├── blocks.js         (renderBlocks + drag & drop)
    ├── components.js     (buildAnsiPalette, buildToggle, buildSegment, buildRow, buildCounter)
    ├── settings.js       (renderSettings + renderXxxSettings + SEP_OPTIONS)
    ├── output.js         (renderOutput, copyScript, copyInstallCmd)
    ├── generator.js      (generateScript)
    └── main.js           (render() + init: render() + setTheme())
```

---

## Порядок подключения в index.html

CSS:
```html
<link rel="stylesheet" href="styles/variables.css">
<link rel="stylesheet" href="styles/layout.css">
<link rel="stylesheet" href="styles/components.css">
<link rel="stylesheet" href="styles/terminal.css">
```

JS (в конце `<body>` в этом порядке — каждый следующий зависит от предыдущих):
```html
<script src="js/ansi.js"></script>
<script src="js/state.js"></script>
<script src="js/bars.js"></script>
<script src="js/theme.js"></script>
<script src="js/preview.js"></script>
<script src="js/blocks.js"></script>
<script src="js/components.js"></script>
<script src="js/settings.js"></script>
<script src="js/output.js"></script>
<script src="js/generator.js"></script>
<script src="js/main.js"></script>
```

---

## Task 1: Создать директории

**Files:**
- Create: `styles/` (директория)
- Create: `js/` (директория)

**Step 1: Создать директории**
```bash
mkdir -p styles js
```

**Step 2: Проверить**
```bash
ls -la
```
Expected: `styles/` и `js/` видны в списке

**Step 3: Commit**
```bash
git add .
git commit -m "chore: scaffold styles/ and js/ directories"
```

---

## Task 2: Вынести CSS — variables.css

**Source:** `statusline-editor.html` строки 8–22 (блок `:root { ... }`)

**Files:**
- Create: `styles/variables.css`

**Step 1: Создать файл `styles/variables.css`**

Скопировать ТОЛЬКО содержимое `:root { ... }` из `<style>`:
```css
:root {
  --bg: #1a1a1a;
  --bg2: #222222;
  --bg3: #2a2a2a;
  --bg4: #333333;
  --border: #3a3a3a;
  --text: #d4d4d4;
  --text-dim: #888888;
  --accent: #e8814d;
  --accent-dim: #7a3f20;
  --green: #4ec94e;
  --yellow: #e8c44d;
  --red: #e84d4d;
  --font: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace;
}
```

**Step 2: Commit (пока без удаления из HTML)**
```bash
git add styles/variables.css
git commit -m "chore: extract CSS variables to styles/variables.css"
```

---

## Task 3: Вынести CSS — layout.css

**Source:** `statusline-editor.html` — всё из `<style>` КРОМЕ `:root`, КРОМЕ компонентов (btn, toggle, segment, color-picker, counter) и КРОМЕ terminal-блока.

**Конкретно — строки:**
- 24 (`* { ... }`)
- 26–32 (`body`)
- 34–41 (`#app`)
- 44–50 (`#header h1`)
- 71–95 (`preview-wrap`, `#preview-label`, `#preview`, `#editor`)
- 97–112 (`#blocks`, `panel-label`)
- 155–171 (`#settings`, `settings-content`, `settings-title`)
- 172–178 (`setting-row`, `setting-label`)
- 258–259 (`threshold-row`, `threshold-label`)
- 261–335 (`#output`, `output-header`, `output-code`, `space-counter`, `counter-btn`, `counter-val`)
- 272–275 (light-mode для `#preview` — перейдёт в terminal.css, но оставляем здесь пока)

**Files:**
- Create: `styles/layout.css`

**Step 1: Создать файл**

Содержимое — см. выше перечисленные блоки из оригинального `<style>`.

**Step 2: Commit**
```bash
git add styles/layout.css
git commit -m "chore: extract layout styles to styles/layout.css"
```

---

## Task 4: Вынести CSS — components.css

**Source:** Строки из `<style>`:
- 51–69 (`.btn`, `.btn-group`, `.btn-primary`)
- 114–153 (`.block-item`, `.drag-handle`, `.block-toggle`, `.block-name`)
- 180–204 (`.toggle`, `.toggle-wrap`, `.toggle-slider`, `.toggle-text`)
- 206–219 (`.segment`, `.segment-btn`)
- 221–238 (`.style-cards`, `.style-card`)
- 240–256 (`.color-picker-wrap`, `.color-swatch`, `.ansi-palette`, `.ansi-cell`)

**Files:**
- Create: `styles/components.css`

**Step 2: Commit**
```bash
git add styles/components.css
git commit -m "chore: extract component styles to styles/components.css"
```

---

## Task 5: Вынести CSS — terminal.css

**Source:** Строки из `<style>`:
- 277–299 (`.theme-toggle`, `.theme-btn`, `#theme-icon`)
- 337–425 (`.term-window` и всё ниже до `</style>`)
- 272–275 (`#preview.light-mode` и `#preview.light-mode .sep-span`)

**Files:**
- Create: `styles/terminal.css`

**Step 2: Commit**
```bash
git add styles/terminal.css
git commit -m "chore: extract terminal preview styles to styles/terminal.css"
```

---

## Task 6: Создать index.html (без JS, только с CSS)

**Files:**
- Create: `index.html`

**Step 1:** Скопировать весь HTML из `statusline-editor.html`.

**Step 2:** В `<head>` ЗАМЕНИТЬ весь блок `<style>...</style>` на:
```html
<link rel="stylesheet" href="styles/variables.css">
<link rel="stylesheet" href="styles/layout.css">
<link rel="stylesheet" href="styles/components.css">
<link rel="stylesheet" href="styles/terminal.css">
```

**Step 3:** Оставить `<script>` блок временно как есть (удалим в следующих тасках).

**Step 4: Проверка визуальная**

Открыть `index.html` в браузере → убедиться, что верстка выглядит идентично оригиналу (без JS функциональности пока не страшно).

**Step 5: Commit**
```bash
git add index.html
git commit -m "feat: create index.html with external CSS links"
```

---

## Task 7: Вынести JS — ansi.js

**Source:** `statusline-editor.html` строки 516–540

**Files:**
- Create: `js/ansi.js`

**Step 1: Создать файл**
```js
// ─────────────────────────────────────────
// ANSI 256 COLOR UTILITIES
// ─────────────────────────────────────────

function ansiToCSS(n) { ... }  // строки 517-536
function ansiEscape(n) { ... } // строки 538-540
```

**Step 2: Commit**
```bash
git add js/ansi.js
git commit -m "chore: extract ANSI utilities to js/ansi.js"
```

---

## Task 8: Вынести JS — state.js

**Source:** Строки 546–576

**Files:**
- Create: `js/state.js`

**Содержимое:**
```js
const DEFAULTS = { ... };         // строки 547-565
let state = JSON.parse(...);      // строка 567
state.blocks.forEach(block => {   // строки 570-574
  ...
});
let selectedBlockId = 'rate5h';   // строка 575
let previewTheme = 'dark';        // строка 576
const MOCK = { ... };             // строки 602-618
```

**Step 2: Commit**
```bash
git add js/state.js
git commit -m "chore: extract state and mock data to js/state.js"
```

---

## Task 9: Вынести JS — bars.js

**Source:** Строки 624–703

**Files:**
- Create: `js/bars.js`

**Содержимое:**
```js
const BAR_STYLES = { ... };           // строки 625-629
function renderBar(...) { ... }        // строки 631-653
function renderColoredBar(...) { ... } // строки 675-703
```

> Примечание: `renderColoredBar` использует `previewTheme` из `state.js` и `BAR_STYLES` из этого же файла — зависимость OK.

**Step 2: Commit**
```bash
git add js/bars.js
git commit -m "chore: extract bar rendering to js/bars.js"
```

---

## Task 10: Вынести JS — theme.js

**Source:** Строки 578–600

**Files:**
- Create: `js/theme.js`

**Содержимое:**
```js
function toggleTheme() { ... }  // строки 578-580
function setTheme(t) { ... }    // строки 583-600
```

> Использует `previewTheme` из `state.js`.

**Step 2: Commit**
```bash
git add js/theme.js
git commit -m "chore: extract theme management to js/theme.js"
```

---

## Task 11: Вынести JS — preview.js

**Source:** Строки 659–777

**Files:**
- Create: `js/preview.js`

**Содержимое:**
```js
function getContextColor(percent) { ... }     // строки 659-666
function formatTokens(n, fmt) { ... }         // строки 668-672
function renderPreview() { ... }              // строки 705-777
```

> Зависит от: `ansiToCSS` (ansi.js), `state`, `MOCK` (state.js), `renderColoredBar` (bars.js), `previewTheme` (state.js).

**Step 2: Commit**
```bash
git add js/preview.js
git commit -m "chore: extract preview renderer to js/preview.js"
```

---

## Task 12: Вынести JS — blocks.js

**Source:** Строки 787–880

**Files:**
- Create: `js/blocks.js`

**Содержимое:**
```js
let dragSrcIdx = null;           // строка 787
function renderBlocks() { ... }  // строки 789-880
```

> Зависит от: `state`, `selectedBlockId` (state.js), `render` (main.js — объявим позже). Циклическая зависимость `render` решается тем, что `render` — глобальная функция, доступная в момент вызова.

**Step 2: Commit**
```bash
git add js/blocks.js
git commit -m "chore: extract blocks panel to js/blocks.js"
```

---

## Task 13: Вынести JS — components.js

**Source:** Строки 885–994

**Files:**
- Create: `js/components.js`

**Содержимое:**
```js
function buildAnsiPalette(currentCode, onChange) { ... }  // 885-956
function buildToggle(checked, label, onChange) { ... }    // 958-970
function buildSegment(options, current, onChange) { ... } // 972-983
function buildRow(label, content) { ... }                 // 985-994
function buildCounter(value, min, max, onChange) { ... }  // 1036-1058
```

**Step 2: Commit**
```bash
git add js/components.js
git commit -m "chore: extract UI components to js/components.js"
```

---

## Task 14: Вынести JS — settings.js

**Source:** Строки 1000–1205

**Files:**
- Create: `js/settings.js`

**Содержимое:**
```js
const SEP_OPTIONS = [...];                               // строка 1034
function renderSettings() { ... }                        // 1000-1032
function renderModelSettings(el, block) { ... }          // 1060-1065
function renderContextSettings(el, block) { ... }        // 1067-1104
function renderRateSettings(el, block) { ... }           // 1106-1156
function renderTokensSettings(el, block) { ... }         // 1158-1171
function renderDirectorySettings(el, block) { ... }      // 1173-1205
```

**Step 2: Commit**
```bash
git add js/settings.js
git commit -m "chore: extract settings panel to js/settings.js"
```

---

## Task 15: Вынести JS — output.js

**Source:** Строки 1207–1242

**Files:**
- Create: `js/output.js`

**Содержимое:**
```js
function renderOutput() { ... }      // 1207-1210
function copyScript() { ... }        // 1219-1228
function copyInstallCmd() { ... }    // 1230-1242
```

**Step 2: Commit**
```bash
git add js/output.js
git commit -m "chore: extract output actions to js/output.js"
```

---

## Task 16: Вынести JS — generator.js

**Source:** Строки 1248–1474

**Files:**
- Create: `js/generator.js`

**Содержимое:**
```js
function generateScript() { ... }   // 1248-1474
```

**Step 2: Commit**
```bash
git add js/generator.js
git commit -m "chore: extract script generator to js/generator.js"
```

---

## Task 17: Создать main.js

**Source:** Строки 1212–1217 + строки 1476–1478

**Files:**
- Create: `js/main.js`

**Содержимое:**
```js
function render() {
  renderPreview();
  renderBlocks();
  renderSettings();
  renderOutput();
}

render();
setTheme(previewTheme);
```

**Step 2: Commit**
```bash
git add js/main.js
git commit -m "chore: create main.js with render entry point"
```

---

## Task 18: Подключить все JS-файлы в index.html и удалить inline `<script>`

**Files:**
- Modify: `index.html`

**Step 1:** В `index.html` УДАЛИТЬ весь блок `<script>...</script>` (строки 511–1478 оригинала).

**Step 2:** ПЕРЕД `</body>` вставить:
```html
<script src="js/ansi.js"></script>
<script src="js/state.js"></script>
<script src="js/bars.js"></script>
<script src="js/theme.js"></script>
<script src="js/preview.js"></script>
<script src="js/blocks.js"></script>
<script src="js/components.js"></script>
<script src="js/settings.js"></script>
<script src="js/output.js"></script>
<script src="js/generator.js"></script>
<script src="js/main.js"></script>
```

**Step 3: Проверка**

Открыть `index.html` в браузере → всё должно работать идентично оригиналу:
- Превью рендерится
- Блоки кликабельны
- Settings панель работает
- "Copy script" и "Copy install cmd" работают
- Тема переключается

Проверить консоль браузера — ошибок нет.

**Step 4: Commit**
```bash
git add index.html
git commit -m "feat: wire up all JS modules in index.html"
```

---

## Task 19: Финальная проверка и cleanup

**Step 1:** Убедиться, что `statusline-editor.html` всё ещё существует (не удалять — это бэкап/оригинал).

**Step 2:** Проверить структуру:
```bash
find . -name "*.html" -o -name "*.css" -o -name "*.js" | grep -v ".git" | sort
```

Expected:
```
./index.html
./js/ansi.js
./js/bars.js
./js/blocks.js
./js/components.js
./js/generator.js
./js/main.js
./js/output.js
./js/preview.js
./js/settings.js
./js/state.js
./js/theme.js
./styles/components.css
./styles/layout.css
./styles/terminal.css
./styles/variables.css
./statusline-editor.html
```

**Step 3:** Финальный коммит:
```bash
git add .
git commit -m "feat: complete modular structure refactor

Split monolithic 1480-line statusline-editor.html into:
- index.html (markup only)
- styles/ (4 files: variables, layout, components, terminal)
- js/ (10 files: ansi, state, bars, theme, preview, blocks,
       components, settings, output, generator, main)"
```

---

## Примечания по зависимостям JS

Порядок подключения обязателен — каждый файл использует глобальные функции/переменные из предыдущих:

```
ansi.js
  └─ state.js (использует: -)
       └─ bars.js (использует: state, BAR_STYLES)
            └─ theme.js (использует: previewTheme)
                 └─ preview.js (использует: ansiToCSS, state, MOCK, renderColoredBar, previewTheme)
                      └─ blocks.js (использует: state, selectedBlockId, render*)
                           └─ components.js (использует: ansiToCSS)
                                └─ settings.js (использует: state, build*, render*, BAR_STYLES, SEP_OPTIONS)
                                     └─ output.js (использует: generateScript, render*)
                                          └─ generator.js (использует: state, BAR_STYLES)
                                               └─ main.js (использует: render*, setTheme, previewTheme)
```

*`render` — циклические зависимости нет, т.к. функция объявляется в main.js и вызывается только после загрузки всех скриптов.
