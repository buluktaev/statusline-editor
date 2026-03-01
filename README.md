# Statusline Editor for Claude Code

**Visual editor for configuring the Claude Code terminal statusline.**

Configure blocks, colors, and thresholds — get a ready-to-use bash script in one click.

![statusline preview](assets/claude_mascot.svg)

---

## What it looks like

```
[Sonnet 4.6]  |  ████████░ 68%  2h14m  |  c30%  |  ↑12.4k ↓3.1k  |  ~/proj/app(main)
```

| Segment | Example | What it shows |
|---|---|---|
| **Model** | `[Sonnet 4.6]` | Active model name |
| **Rate 5h** | `████░░░░ 68% 2h14m` | 5-hour usage limit — bar, remaining %, time to reset |
| **Rate Week** | `███░░░░░ 42% 4d3h` | Weekly usage limit — bar, remaining %, time to reset |
| **Context %** | `c30%` | Context window fill — changes color at 50% and 80% |
| **Tokens** | `↑12.4k ↓3.1k` | Input / output tokens in current session |
| **Directory** | `~/proj/app(main)` | Working directory + git branch |

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

- **bash** — script runs in bash
- **jq** — parses JSON from Claude Code hooks
- **python3** — time calculations for rate reset countdown
- **macOS Keychain** — needed for Rate blocks (reads OAuth token automatically)

The Rate 5h / Rate Week blocks query the Anthropic API for your usage limits. The token is read from macOS Keychain where Claude Code stores it — no manual setup required.

---

## How it works

Claude Code passes a JSON object to the statusline script via stdin on every prompt. The script extracts:

- `model.display_name` — current model
- `context_window.used_percentage` — context fill %
- `context_window.total_input_tokens` / `total_output_tokens` — session tokens
- `cwd` — working directory

Rate data is fetched from `https://api.anthropic.com/api/oauth/usage` and cached locally for 2 minutes to avoid slowing down the prompt.

The editor generates the full bash script from your configuration and shows a live preview so you can see the result before copying.

---

## Settings are saved

The editor stores your configuration in `localStorage` — settings persist between sessions. Use the **Reset** button to return to defaults.
