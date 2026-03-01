# Statusline Editor

## Status
Активен — идёт разработка веб-редактора конфигурации статусбара Claude Code.

## Description
Одностраничное веб-приложение (HTML/CSS/JS) для визуального редактирования statusline Claude Code.
Позволяет настраивать блоки статусбара, видеть превью в реальном времени и копировать готовый shell-скрипт.

## Architecture
- Стек: vanilla HTML/CSS/JS (без фреймворков и сборщиков)
- Структура: модульная (`index.html` + 4 CSS + 11 JS файлов в папках `styles/` и `js/`)
- Превью: окно Claude Code терминала (`.term-window`) с live-preview статусбара
- Темы: Dark / Light — переключаются на `.term-window`
- Dev: запустить `python3 -m http.server 8080`, открыть `http://localhost:8080/index.html`
- Git: репозиторий + remote на GitHub (`buluktaev/statusline-editor`), `.worktrees/` в `.gitignore`

## Current State
- Last session: 2026-03-01
- Done:
  - ✅ Модульная структура: разделён монолитный HTML на index.html + 4 CSS + 11 JS файлов
  - ✅ Добавлено превью шкалы в начало Rate 5h/Week настроек
  - ✅ Удалены лишние spacer'ы перед "Показывать шкалу"
  - CSS: variables.css, layout.css, components.css, terminal.css
  - JS: ansi.js, state.js, bars.js, theme.js, preview.js, blocks.js, components.js, settings.js, output.js, generator.js, main.js
  - statusline-editor.html сохранён как бэкап (не удалён)
- Uncommitted: нет

## Unresolved Problems
— нет

## Decisions Made
- [2026-02-27] Превью оборачивается в .term-window, а не отдельный компонент — чтобы не плодить файлы
- [2026-02-27] Light-mode класс применяется на .term-window, а не на #preview — для единого переключения темы
- [2026-02-27] Фон терминала (#1e1e1e) единый для тела и статусбара — убрана граница между ними
- [2026-02-27] Git инициализирован в проекте для поддержки worktrees
- [2026-02-27] `renderColoredBar` принимает `fillColorOverride` — цвет шкалы из block.color, не хардкод

## Next Steps
1. По мере правки дизайна в Design In The Browser - обновлять и тестировать на localhost

## Session History
- [2026-03-01] Третья сессия: полный рефакторинг на модульную структуру (1480 строк → 15 файлов), добавлено превью шкалы в Rate настройки
- [2026-02-27] Вторая сессия: фикс цвета шкалы rate-блоков, цвет таймера, порядок настроек, GitHub push
- [2026-02-27] Первая сессия: создание превью в виде окна Claude Code, настройка тем, git init
