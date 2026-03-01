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
  const iconColor = isDark ? 'white' : '%23555555';
  if (isDark) {
    // Dark theme active → show sun (click to switch to light)
    iconEl.innerHTML = `<img src="https://api.iconify.design/line-md:sunny-filled-loop.svg?width=16&height=16&color=${iconColor}" width="16" height="16" alt="Switch to light mode">`;
  } else {
    // Light theme active → show moon (click to switch to dark)
    iconEl.innerHTML = `<img src="https://api.iconify.design/line-md:moon-rising-filled-alt-loop.svg?width=16&height=16&color=${iconColor}" width="16" height="16" alt="Switch to dark mode">`;
  }
}
