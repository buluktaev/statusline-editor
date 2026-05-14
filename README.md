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

**3. Copy the script**

Click **Copy** in the OUTPUT panel — you get a ready bash script.

**4. Set it up in Claude Code**

Paste the script to a file, e.g. `~/.claude/statusline.sh`, make it executable:

```bash
chmod +x ~/.claude/statusline.sh
```

Then add to your Claude Code settings (`~/.claude/settings.json`):

```json
{
  "statusline": "~/.claude/statusline.sh"
}
```

---

## Requirements

- **bash** — script runs in bash (on Windows: Git Bash / WSL)
- **jq** — parses JSON from Claude Code hooks
- **python3** — time calculations for rate reset countdown

Rate blocks (5h / Week) need one extra dependency depending on your platform:

| Platform | Credential storage | Extra requirement |
|---|---|---|
| **macOS** | Keychain | nothing — works out of the box |
| **Linux** | libsecret (GNOME Keyring / KWallet) | `sudo apt install libsecret-tools` |
| **Windows** (Git Bash) | Credential Manager | `Install-Module -Name CredentialManager` in PowerShell |
| **WSL** | same as Linux | `sudo apt install libsecret-tools` |

The script auto-detects the OS via `uname -s` and reads the token using the right method.

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
