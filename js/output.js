function renderOutput() {
  const el = document.getElementById('output-code');
  if (el) el.textContent = generateScript();
}

function copyScript() {
  navigator.clipboard.writeText(generateScript()).then(() => {
    document.querySelectorAll('.btn').forEach(b => {
      if (b.textContent === 'Copy script') {
        b.textContent = '✓ Copied!';
        setTimeout(() => b.textContent = 'Copy script', 1500);
      }
    });
  });
}

function copyInstallCmd() {
  const script = generateScript();
  const b64 = btoa(unescape(encodeURIComponent(script)));
  const cmd = `mkdir -p ~/.claude && echo '${b64}' | base64 -d > ~/.claude/statusline.sh && chmod +x ~/.claude/statusline.sh && echo '✓ Done'`;
  navigator.clipboard.writeText(cmd).then(() => {
    document.querySelectorAll('.btn-primary').forEach(b => {
      if (b.textContent === 'Copy install cmd') {
        b.textContent = '✓ Copied!';
        setTimeout(() => b.textContent = 'Copy install cmd', 2000);
      }
    });
  });
}
