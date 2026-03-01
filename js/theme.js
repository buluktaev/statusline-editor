function toggleTheme() {
  previewTheme = previewTheme === 'dark' ? 'light' : 'dark';
  setTheme(previewTheme);
}

function setTheme(t) {
  previewTheme = t;
  const termWindow = document.querySelector('.term-window');
  if (t === 'light') termWindow.classList.add('light-mode');
  else termWindow.classList.remove('light-mode');

  // Update icon
  const iconEl = document.getElementById('theme-icon');
  const isDark = t === 'dark';
  iconEl.style.cssText = 'width:16px;height:16px;display:flex;align-items:center;justify-content:center;';
  if (isDark) {
    // Show moon icon for dark mode
    iconEl.innerHTML = '<img src="https://api.iconify.design/line-md:moon-rising-filled-alt-loop.svg?width=16&height=16&color=white" width="16" height="16" alt="Dark mode">';
  } else {
    // Show sun icon for light mode
    iconEl.innerHTML = '<img src="https://api.iconify.design/line-md:moon-filled-alt-to-sunny-filled-loop-transition.svg?width=16&height=16&color=white" width="16" height="16" alt="Light mode">';
  }
}
