function render() {
  renderPreview();
  renderBlocks();
  renderSettings();
  renderOutput();
  saveState();
}

render();
setTheme(previewTheme);
