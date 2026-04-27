# Agent Notes for This Stretchly Fork

This fork customizes Stretchly into a time-aware rehab break app with optional fake update screens.

## Product Direction

- Keep the original Stretchly break behavior available as the default/classic mode.
- Add a second break screen style that can look like a Windows Update or FakeUpdate.net screen.
- Use the user's personal rehab plan from `每日精准康复计划表.md` as the basis for time-aware exercise tips.
- Rehab tips should not be bound to exact clock rows from the plan. Instead, use broad time buckets:
  - `morning`: combines 晨起 + 上午.
  - `midday`: combines 午间 + 下午.
  - `evening`: 晚间.
- The app should read local system time when a break starts and randomly choose an idea from the matching bucket.

## Current Custom Features

- `breakScreenMode`
  - `classic`: original Stretchly break screen.
  - `windowsUpdate`: fake update style break screen.
- `fakeUpdateTheme`
  - `local`: built-in fake Windows Update screen.
  - FakeUpdate.net external iframe themes:
    - `fakeupdate-win11`
    - `fakeupdate-win10`
    - `fakeupdate-win10ue`
    - `fakeupdate-win8`
    - `fakeupdate-win7`
    - `fakeupdate-vista`
    - `fakeupdate-xp`
    - `fakeupdate-windows98`
    - `fakeupdate-apple`
- `timeAwareRehabTips`
  - Enables the broad time bucket rehab idea selection.
- `timeAwareRehabIdeaGroups`
  - User-editable rehab idea library.
  - Shape:
    ```json
    {
      "morning": {
        "miniBreakIdeas": ["short idea text"],
        "longBreakIdeas": [{ "title": "Title", "text": "Long idea text" }]
      },
      "midday": {
        "miniBreakIdeas": [],
        "longBreakIdeas": []
      },
      "evening": {
        "miniBreakIdeas": [],
        "longBreakIdeas": []
      }
    }
    ```

## Rehab Editor UX

- Preferences has two rehab idea views:
  - Table view for spreadsheet-like editing.
  - JSON view for import/bulk editing.
- Supports undo/redo:
  - `Ctrl+Z`: undo.
  - `Ctrl+Y` or `Ctrl+Shift+Z`: redo.
  - Also has Undo/Redo buttons.
- Undo/redo should cover add, delete, table text edits, reset, and JSON save.

## Important Files

- `app/utils/timedRehabIdeas.js`
  - Time bucket selection and normalization for the rehab idea groups.
- `app/main.js`
  - Loads regular ideas and time-aware rehab ideas.
  - Refreshes time-aware idea pools when `timeAwareRehabIdeaGroups` is saved.
- `app/preferences.html`
  - Settings UI, rehab idea editor, fake update theme select.
- `app/preferences-renderer.js`
  - Rehab editor behavior, JSON/table view, undo/redo, conditional fake update theme visibility.
- `app/break-renderer.js`
  - Long break screen rendering, local/external fake update selection.
- `app/microbreak-renderer.js`
  - Mini break screen rendering, local/external fake update selection.
- `app/css/break.css`
  - Local fake update and external iframe screen styling.
- `app/css/preferences.css`
  - Rehab editor table/JSON UI styling.
- `app/locales/en.json` and `app/locales/zh-CN.json`
  - Added strings for rehab editor, fake update settings, and rehab ideas.
- `app/utils/defaultSettings.js`
  - Added default keys for the custom features.

## Agent Documentation Practice

- When discovering repo-specific setup, run, build, packaging, or troubleshooting details, add them to this file so future agents inherit the knowledge.
- Prefer concrete commands and platform-specific notes over generic guidance.
- Keep existing Windows and macOS instructions aligned when a workflow has equivalent commands on both platforms.
- Whenever an agent changes files in this repo, include a concise suggested commit message in the final response.

## Rehab Plan Safety Notes

- The source rehab plan says to stop squats for now.
- The original default mini break squat-like idea was replaced with a safety warning.
- Training should stop if back burning or ankle numbness worsens.
- Progression should be gradual after one week without worsening symptoms.

## Running Locally on macOS

- The repo's `.nvmrc` currently specifies Node `24.15.0`.
- If `npm` is not on `PATH`, install/load Node with `nvm` first:
  ```bash
  nvm install 24.15.0
  nvm use 24.15.0
  ```
- If `nvm` itself is missing (`zsh: command not found: nvm`), either install Node directly from <https://nodejs.org/> or install `nvm` first. With Homebrew:
  ```bash
  brew install nvm
  mkdir -p ~/.nvm
  ```
  Homebrew does not automatically load `nvm` into zsh. On Apple Silicon/Homebrew under `/opt/homebrew`, add these lines to `~/.zshrc`:
  ```bash
  export NVM_DIR="$HOME/.nvm"
  [ -s "/opt/homebrew/opt/nvm/nvm.sh" ] && \. "/opt/homebrew/opt/nvm/nvm.sh"
  [ -s "/opt/homebrew/opt/nvm/etc/bash_completion.d/nvm" ] && \. "/opt/homebrew/opt/nvm/etc/bash_completion.d/nvm"
  ```
  On Intel/Homebrew under `/usr/local`, use `/usr/local/opt/nvm/...` in those paths instead.
  Restart the terminal, or run `source ~/.zshrc`, then run the `nvm install` / `nvm use` commands above.
- Useful commands:
  ```bash
  npm ci
  npm start
  npm run lint
  npm test
  ```

## Building on macOS

- Directory build / unpacked `.app`:
  ```bash
  npm run pack
  ```
- Distributable `.dmg` build:
  ```bash
  npm run dist
  ```
- `package.json` configures the macOS target as a DMG for both `x64` and `arm64`.
- For a local unsigned/personal build, if code signing discovery blocks the build, try:
  ```bash
  CSC_IDENTITY_AUTO_DISCOVERY=false npm run dist
  ```
- Unlike Windows, do not use `npm.cmd` or `npx.cmd` on macOS; use `npm` and `npx` directly.
- If `electron-builder` fails with `Application at path could not be found`, confirm the command was run from the repo root after `npm ci`, then capture the full command and the build log lines above the error. The usual first checks are that `node_modules` exists, `npm run pack` can create the unpacked `.app`, and the expected output appears under `dist/`.

## Running Locally on Windows

- The repo's `.nvmrc` currently specifies Node `24.15.0`.
- If `npx.ps1` or `npm.ps1` is blocked by PowerShell execution policy, use:
  - `npm.cmd ...`
  - `npx.cmd ...`
- Useful commands:
  ```powershell
  npm.cmd ci
  npm.cmd start
  npm.cmd run lint
  npm.cmd test
  ```

## Building on Windows

- Directory build:
  ```powershell
  npm.cmd run pack
  ```
- Portable build:
  ```powershell
  npx.cmd electron-builder --win portable
  ```
- Installer build:
  ```powershell
  npx.cmd electron-builder --win nsis
  ```
- If the build fails with symbolic link privilege errors:
  - Run PowerShell as Administrator, or
  - Enable Windows Developer Mode.

## Current Known Issue

- A previous commit attempt failed because `standard` reported style issues in the pre-commit hook.
- Run this before committing:
  ```powershell
  npx.cmd standard --fix
  npm.cmd run lint
  ```
- At the time these notes were added, `git status --short` showed modified:
  - `app/preferences-renderer.js`
  - `app/utils/timedRehabIdeas.js`
- If committing on macOS fails with `.husky/pre-commit: line 1: npm: command not found`, Git is running the Husky hook without `npm` on `PATH`. Keep SourceTree workflows working by making the hook load the repo's `.nvmrc` Node path and common Homebrew paths before calling `npm run lint`; do not require the user to switch to Terminal commits as the primary fix.
