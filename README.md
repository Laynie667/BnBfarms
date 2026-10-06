# 🌾 B&B Farm: Farmhand

Two scripts that run the B&B Farm map room in Bondage Club:

| Script | Who runs it | What it does |
|---|---|---|
| **Farmhand Bot** (`dist/farmhand-bot.user.js`) | Only the bot account (260239) | Keeps the farm's records, answers commands, runs milk, breeding, shots, keys, summons, emotes. |
| **Farmhand Companion** (`dist/farmhand-companion.user.js`) | Any farm player who wants it | Adds a 🌾 button and panel to the game. The bot's answers land there instead of in whispers and beeps. Adds `/farm <command>`. |

Players without the Companion still get beeps and whispers, exactly like before.

## Install

You need **Tampermonkey** in your browser first (Chrome, Edge, Firefox; on a phone, a browser that supports it, like Kiwi or Firefox).
Then click a link below. Tampermonkey opens its install page; press **Install**. After that the script keeps itself up to date: Tampermonkey checks this repository about once a day and updates when there's a newer version (or right away from Tampermonkey's dashboard: **Utilities → Check for userscript updates**).

**Players**

| Script | What it does |
|---|---|
| [**Farmhand Companion**](https://raw.githubusercontent.com/Laynie667/BnBfarms/main/dist/farmhand-companion.user.js) | The 🌾 button and panel: your farm life, your record, your herd, the staff tabs for staff. Optional; the farm works without it. |
| [**Farm Watcher**](https://raw.githubusercontent.com/Laynie667/BnBfarms/main/dist/farm-watcher.user.js) | Diagnostics only: records what your game sees for a while and saves a text file to send in when something's wrong. |

**The farm bot's computer only** (account 260239)

| Script | What it does |
|---|---|
| [**Farmhand Bot**](https://raw.githubusercontent.com/Laynie667/BnBfarms/main/dist/farmhand-bot.user.js) | The farm girl herself: the books, commands, milking, breeding, keys, summons, scenes. |
| [Glory stalls](https://raw.githubusercontent.com/Laynie667/BnBfarms/main/dist/farmhand-glory-stalls.user.js) | Glory stall scenes, real visitors, shifts. |
| [Dairy](https://raw.githubusercontent.com/Laynie667/BnBfarms/main/dist/farmhand-dairy.user.js) | Warmer milking lines and the weekly milk certificate. |
| [Breeding](https://raw.githubusercontent.com/Laynie667/BnBfarms/main/dist/farmhand-breeding.user.js) | Pregnancy stages, belly, cravings, midwife. |
| [Barn life](https://raw.githubusercontent.com/Laynie667/BnBfarms/main/dist/farmhand-barn-life.user.js) | Hunger, thirst, grooming, troughs. |
| [Conditioning](https://raw.githubusercontent.com/Laynie667/BnBfarms/main/dist/farmhand-conditioning.user.js) | Guided trance sessions (opt-in). |
| [Work](https://raw.githubusercontent.com/Laynie667/BnBfarms/main/dist/farmhand-work.user.js) | Chores and staff points. |
| [Shows](https://raw.githubusercontent.com/Laynie667/BnBfarms/main/dist/farmhand-shows.user.js) | Fairs and shows. |
| [Map tools](https://raw.githubusercontent.com/Laynie667/BnBfarms/main/dist/farmhand-map-tools.user.js) | Zone and spot helpers. |

**Already installed from a file?** Click the link once anyway and press **Reinstall** (or Update): that's what turns on automatic updates. Your settings and the farm's books are kept; they live in the browser, not in the script.

Current versions and what changed lately: [INSTALL-STATUS.md](INSTALL-STATUS.md).

## What's where

```
farmhand/
├─ bot/
│  ├─ header.txt          the Tampermonkey header for the bot
│  └─ src/
│     ├─ farmhand.js      the bot itself (still one big file; we split it up next)
│     └─ version.js
├─ extension/
│  ├─ header.txt          the Tampermonkey header for the Companion
│  └─ src/
│     ├─ index.js         talks to the bot, hooks the game
│     ├─ panel.js         the 🌾 button and panel
│     └─ config.js        bot number, quick buttons
├─ shared/
│  └─ protocol.js         the hidden-message "language" both scripts speak
├─ tests/                 fake-game tests: npm test
├─ docs/PLAN.md           the plan for splittin' things up
├─ dist/                  the finished scripts you paste into Tampermonkey (made by npm run build)
├─ build.mjs              glues src files into the dist scripts
└─ package.json           versions live here ("versions": bot and companion)
```

**Rule of thumb:** you edit files in `bot/src`, `extension/src` and `shared/`. You never edit `dist/`; it gets rebuilt.

## First-time setup on your PC (once)

1. Install **Node.js LTS** from https://nodejs.org (click the big LTS button, then Next through the installer).
2. Install **Git** from https://git-scm.com (all the default options are fine).
3. Install **VS Code** from https://code.visualstudio.com. That's where you'll read and edit the files.
4. Optional but handy: **GitHub Desktop** from https://desktop.github.com, so you can save versions with buttons instead of typing.
5. Unzip this folder somewhere easy, like `Documents\farmhand`.
6. In VS Code: **File → Open Folder…** and pick that folder.
7. Open the terminal in VS Code: **Terminal → New Terminal**. Type this and press Enter:
   ```
   npm install
   ```
   That downloads the two helpers (esbuild and the Mod SDK) into `node_modules`.

## Every time you change something

```
npm run build      makes fresh scripts in dist/
npm test           builds, then runs the fake-game tests (✅ or ❌ for each check)
npm run watch      rebuilds by itself every time you save (Ctrl+C stops it)
```

Then commit and push: every installed copy updates itself within a day (Tampermonkey compares the `@version`, so bump it, see below).

When you change the bot, bump `"bot"` under `"versions"` in `package.json` (0.9.25 → 0.9.26). The Companion and the watcher have their own entries there; each add-on keeps its version in its `addon.json`. **Without a higher version, Tampermonkey won't pick the change up.**

## Saving versions with Git

Git keeps every saved version, so you can always go back. In GitHub Desktop: **File → Add local repository**, pick the folder, and it offers to make it a repository. After that: tick your changed files, write a short note like "bigger knot emotes", click **Commit**, then **Push** to send it to GitHub.

This repository is **public**: that's what lets Tampermonkey install and update the scripts from it. Nothing private lives in it (the bot's login and the farm's books stay in the bot's browser), but the code, the farm's rules and its adult content, and a few member numbers are readable by anyone with the link.

## After installing the Companion

Reload Bondage Club and walk into B&B Farm. The 🌾 button shows bottom right; it says "connected" once the farm girl answers.
