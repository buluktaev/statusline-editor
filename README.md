# Statusline Editor for Claude Code

**Visual editor for configuring the Claude Code terminal statusline.**

Configure blocks, colors, and thresholds — get a ready-to-use bash script in one click.

![statusline preview](assets/claude_mascot.svg)

---

## What it looks like

```
Sonnet 4.6  |  ████████░ h:68% 2h14m  |  w:42%  |  c:30% (60K/200K)  |  ↑12.4k ↓3.1k  |  ~/proj/app  |  (main ✗ +3~2)
```

| Segment | Example | What it shows |
|---|---|---|
| **Model** | `Sonnet 4.6` | Active model name |
| **Rate 5h** | `████░░░░ h:68% 2h14m` | 5-hour usage limit — bar, remaining %, time to reset |
| **Rate Week** | `███░░░░░ w:42% 4d3h` | Weekly usage limit — bar, remaining %, time to reset |
| **Context %** | `c:30% (60K/200K)` | Context window fill — changes color at 50% and 80% |
| **Tokens** | `↑12.4k ↓3.1k` | Input / output tokens in current session |
| **Directory** | `~/proj/app` | Working directory (configurable depth) |
| **Git** | `(main ✗ +3~2)` | Branch, clean/dirty status, staged/modified counts |

Colors change automatically:

- Context **0–49%** → gray
- Context **50–79%** → orange
- Context **80–100%** → red

---

## How to use

**1. Open the editor**

Open `index.html` in any browser — no server or installation needed.

**2. Configure your statusline**

- Toggle blocks on/off
- Drag to reorder
- Click a block to edit its colors and options

**3. Install the script**

Two options in the OUTPUT panel:

- **Copy install cmd** *(easiest)* — one-liner that creates `~/.claude/statusline.sh`, decodes the script, and runs `chmod +x`. Just paste into your terminal.
- **Copy script** — raw bash script. Save it to a file (e.g. `~/.claude/statusline.sh`) and `chmod +x` it yourself.

**4. Enable in Claude Code**

Add to your Claude Code settings (`~/.claude/settings.json`):

```json
{
  "statusLine": {
    "type": "command",
    "command": "~/.claude/statusline.sh"
  }
}
```

Restart Claude Code (or open a new session) — the statusline appears at the bottom of every prompt.

---

## Requirements

- **bash** — script runs in bash (on Windows: Git Bash / WSL)
- **jq** — parses JSON from Claude Code hooks
- **Python** — time calculations for rate reset countdown (auto-detects `python3`, `python`, or `py`)

Rate blocks (5h / Week) need one extra dependency depending on your platform:

| Platform | Credential storage | Extra requirement |
|---|---|---|
| **macOS** | Keychain | nothing — works out of the box |
| **Linux** | libsecret (GNOME Keyring / KWallet) | `sudo apt install libsecret-tools` |
| **Windows** (Git Bash) | Credential Manager | `Install-Module -Name CredentialManager` in PowerShell |
| **WSL** | Windows Credential Manager (via `powershell.exe`) | `Install-Module -Name CredentialManager` in Windows PowerShell |

The script auto-detects the OS via `uname -s` (and `/proc/version` to distinguish WSL from native Linux) and reads the token using the right method.

### Windows notes

- **Save the script with LF line endings** (not CRLF). Otherwise bash will fail with `bad interpreter: /bin/bash^M`. VS Code: bottom-right status bar → `CRLF` → switch to `LF`. Or run `dos2unix statusline.sh`.
- **Git Bash performance**: each prompt spawns `powershell.exe` to read the token (~1s startup). The script caches results for 5 minutes, so this hit only happens once every 5 min.
- **Python on Windows** is usually installed as `python` or `py` — both are detected automatically.

---

## How it works

Claude Code passes a JSON object to the statusline script via stdin on every prompt. The script extracts:

- `model.display_name` — current model
- `context_window.used_percentage` — context fill %
- `context_window.total_input_tokens` / `total_output_tokens` — session tokens
- `cwd` — working directory

Rate data is fetched from `https://api.anthropic.com/api/oauth/usage` and cached locally for 5 minutes to avoid slowing down the prompt and hitting rate limits.

The editor generates the full bash script from your configuration and shows a live preview so you can see the result before copying.

---

## Settings are saved

The editor stores your configuration in `localStorage` — settings persist between sessions. Use the **Reset** button to return to defaults.
