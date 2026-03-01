function render() {
  renderPreview();
  renderBlocks();
  renderSettings();
  renderOutput();
  saveState();
  const btn = document.querySelector('.btn-reset');
  if (btn) btn.classList.toggle('dirty', isDirty());
}

render();
setTheme(previewTheme);
