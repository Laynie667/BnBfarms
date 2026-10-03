# 🌾 B&B Farm: Farmhand

Two scripts that run the B&B Farm map room in Bondage Club:

| Script | Who runs it | What it does |
|---|---|---|
| **Farmhand Bot** (`dist/farmhand-bot.user.js`) | Only the bot account (260239) | Keeps the farm's records, answers commands, runs milk, breeding, shots, keys, summons, emotes. |
| **Farmhand Companion** (`dist/farmhand-companion.user.js`) | Any farm player who wants it | Adds a 🌾 button and panel to the game. The bot's answers land there instead of in whispers and beeps. Adds `/farm <command>`. |

Players without the Companion still get beeps and whispers, exactly like before.

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

Then open the file in `dist/`, copy all of it, and paste it over the old script in Tampermonkey.

When you change the bot, bump `"bot"` under `"versions"` in `package.json` (0.9.25 → 0.9.26) so you can tell versions apart in ?health.

## Saving versions with Git

Git keeps every saved version, so you can always go back. In GitHub Desktop: **File → Add local repository**, pick the folder, and it offers to make it a repository. After that: tick your changed files, write a short note like "bigger knot emotes", click **Commit**, then **Push** to send it to GitHub.

Make the GitHub repository **private**. It holds farm rules and adult content, and the bot's member numbers.

## Installing the Companion (players)

1. Install Tampermonkey in your browser.
2. Open `dist/farmhand-companion.user.js`, copy it all, and in Tampermonkey: **Create a new script**, paste, save.
3. Reload Bondage Club and walk into B&B Farm. The 🌾 button shows bottom right. It says "connected" once the farm girl answers.

Later we can host it so players click one link to install, and it updates itself (see docs/PLAN.md).
