# Running the farm bot on a DigitalOcean server

This moves the Farmhand bot off your PC and onto a small rented server, so the farm stays open when your PC is off.
The server opens the game in a browser with no screen, loads the same bot and add-ons from `dist/`, and keeps the
farm's books (the ledger) in a file. It logs itself in, finds the farm room, and restarts itself if anything drops.

**What it costs:** about $12 a month (the 2 GB droplet). The $6 one (1 GB) may work but is tight for a browser.

**Before you start, have ready:**
- the bot account's login name and password (account 260239)
- a DigitalOcean account (digitalocean.com)

**One rule:** the bot's account can only be in one place. When the server starts, the bot's tab on your PC must be closed.

---

## 1. Make the server (5 minutes)

1. On DigitalOcean: **Create → Droplets**.
2. **Region:** the one nearest you (for Central time, New York or Toronto are fine).
3. **Image:** Ubuntu **24.04 (LTS) x64**.
4. **Size:** Basic → Regular → **2 GB / 1 CPU ($12/mo)**.
5. **Authentication:** choose **Password** and make a strong root password (write it down). An SSH key is better if you already use one.
6. **Hostname:** `bnb-farm`. Click **Create Droplet** and wait a minute.

## 2. Set it up (10 minutes, mostly waiting)

1. Click the new droplet, then **Access → Launch Droplet Console**. A black window opens, logged in as root.
2. Paste this one line and press Enter:

```bash
curl -fsSL https://raw.githubusercontent.com/Laynie667/BnBfarms/main/vps/setup.sh -o setup.sh && bash setup.sh
```

It installs everything (updates, Node, the browser, a firewall that only lets you in) and downloads the farm's files.
When it finishes it prints the three steps below.

## 3. Give it the bot's login

```bash
nano /home/farmhand/BnBfarms/vps/.env
```

Fill in the two lines at the top (the bot's login **name** and password):

```
BOT_USER=the-bots-login-name
BOT_PASS=the-bots-password
```

`TZ=America/Chicago` is already set, so greetings, curfew, feeding time and breedin' season run on your clock.
Save with **Ctrl+O**, **Enter**, then leave with **Ctrl+X**. Only the server can read this file; it is never sent to GitHub.

## 4. Bring the farm's books over

On your **PC**, in the bot's game tab: Tampermonkey icon → **Farmhand: export ledger**. A file named
`bnb-ledger-2026-10-09.json` (today's date) lands in Downloads.

Send it to the server. In PowerShell on your PC (use your droplet's IP address, shown on its DigitalOcean page):

```bash
scp "$HOME\Downloads\bnb-ledger-2026-10-09.json" root@YOUR.DROPLET.IP:/root/
```

Then in the droplet console:

```bash
sudo -u farmhand node /home/farmhand/BnBfarms/vps/import-ledger.mjs /root/bnb-ledger-2026-10-09.json
```

It answers with how many records, spots and applications it imported. If you skip this step the server starts
with empty books.

**Your private add-on** is not on GitHub, so it has to be copied the same way if you want it on the server:

```bash
scp "$HOME\OneDrive\Documents\Bondageproject\farmhand\dist\farmhand-private-laynie.user.js" root@YOUR.DROPLET.IP:/home/farmhand/BnBfarms/dist/
```

## 5. Switch over

1. **Close the bot's game tab on your PC** (or log that account out).
2. In the droplet console:

```bash
systemctl start farmhand
journalctl -u farmhand -f
```

Within a couple of minutes you should see a line like:

```
ok · logged in as 260239 · in "B&B Farm" with 3 others · bot v0.19.0, 9 add-ons
```

Press **Ctrl+C** to stop watching the log (the bot keeps running). Whisper the bot `?ping` in game to be sure.
From now on it starts by itself whenever the server reboots.

---

## Everyday

| I want to… | Type this in the droplet console |
|---|---|
| see what it's doing | `journalctl -u farmhand -f` |
| see the last hour | `journalctl -u farmhand --since "1 hour ago"` |
| restart the bot | `systemctl restart farmhand` |
| stop it (to run on the PC again) | `systemctl stop farmhand` |
| is it running? | `systemctl status farmhand` |

**Updates are automatic.** Every 30 minutes the server checks GitHub; when new scripts arrive it reloads the game
with them. Nothing to do. (Your private add-on is the exception: copy the new file over with the `scp` line above
and the server picks it up within 30 minutes, or right away with `systemctl restart farmhand`.)

**Backups.** The books are in `/home/farmhand/BnBfarms/vps/data/store.json`, and the server keeps a dated copy for
each of the last 14 days beside it. To pull a copy down to your PC:

```bash
scp root@YOUR.DROPLET.IP:/home/farmhand/BnBfarms/vps/data/store.json "$HOME\Downloads\farm-store-backup.json"
```

In game, `?backup` still works as before.

**Going back to the PC.** `systemctl stop farmhand` on the server, then open the bot's tab on the PC. The PC's
Tampermonkey still has the ledger from the day you left; to bring the newer books back, ask Claude to convert the
server's `store.json` for you.

## If something's wrong

- **`NOT READY · not logged in`** for more than a few minutes: the login in `.env` is wrong, or the account is
  open somewhere else. Fix `.env`, then `systemctl restart farmhand`.
- **`saved login refused`** in the log: the game rejected the name or password. The bot won't retry a wrong
  password (so the account can't get locked). Fix `.env` and restart.
- **`no room`**: the bot logged in but the farm room isn't there yet. It rebuilds the room from its saved map by
  itself; give it two minutes. If it doesn't, the ledger wasn't imported (step 4).
- **It keeps restarting / out of memory**: the 1 GB droplet is too small. Resize to 2 GB in DigitalOcean
  (Droplet → Resize), no reinstall needed.
- **Other mods the bot account uses** (FUSAM, BCX, LSCG…) are not loaded on the server. The farm bot doesn't need
  them. If you want one, put its loader address in `EXTRA_SCRIPTS=` in `.env`.

## What's in this folder

| File | What it is |
|---|---|
| `setup.sh` | sets up a fresh Ubuntu server, start to finish |
| `run.mjs` | the runner: opens the game, loads the scripts, saves the ledger, watches and restarts |
| `import-ledger.mjs` | puts an exported ledger into the server's store |
| `farmhand.service` | makes it start on boot and restart if it stops |
| `.env.example` | the settings, copied to `.env` by the setup |
| `selftest.mjs` | checks the runner against a pretend game page (no login) |
