#!/usr/bin/env bash
# Sets up a fresh Ubuntu 24.04 server (a DigitalOcean droplet) to run the Farmhand bot.
# Run it once, as root:   bash setup.sh
set -euo pipefail
if [ "$(id -u)" -ne 0 ]; then echo "Run me as root:  sudo bash setup.sh"; exit 1; fi

echo "== 1/6 updates and tools"
apt-get update -y
DEBIAN_FRONTEND=noninteractive apt-get upgrade -y
apt-get install -y git curl ca-certificates ufw

echo "== 2/6 a little swap, so the browser never runs the server out of memory"
if ! swapon --show | grep -q .; then
  fallocate -l 2G /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile
  echo '/swapfile none swap sw 0 0' >> /etc/fstab
fi

echo "== 3/6 Node.js 22"
if ! command -v node >/dev/null || [ "$(node -v | cut -c2- | cut -d. -f1)" -lt 20 ]; then
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
  apt-get install -y nodejs
fi

echo "== 4/6 the farmhand user and the farm's files"
id farmhand >/dev/null 2>&1 || adduser --disabled-password --gecos "" farmhand
if [ ! -d /home/farmhand/BnBfarms ]; then
  sudo -u farmhand git clone https://github.com/Laynie667/BnBfarms.git /home/farmhand/BnBfarms
else
  sudo -u farmhand git -C /home/farmhand/BnBfarms pull --ff-only
fi
cd /home/farmhand/BnBfarms/vps
sudo -u farmhand npm install --omit=dev

echo "== 5/6 the browser (Chromium) and what it needs"
npx --yes playwright install-deps chromium
sudo -u farmhand npx --yes playwright install chromium

echo "== 6/6 the firewall (only SSH comes in) and the service"
ufw allow OpenSSH >/dev/null && ufw --force enable >/dev/null
[ -f .env ] || { sudo -u farmhand cp .env.example .env; chmod 600 .env; chown farmhand:farmhand .env; }
cp farmhand.service /etc/systemd/system/farmhand.service
systemctl daemon-reload
systemctl enable farmhand >/dev/null

cat <<'DONE'

All set up. Three things left, in this order:

  1. The bot's login:      nano /home/farmhand/BnBfarms/vps/.env
     (fill in BOT_USER and BOT_PASS, then Ctrl+O, Enter, Ctrl+X)

  2. The farm's books:     copy your exported ledger to the server, then
     sudo -u farmhand node /home/farmhand/BnBfarms/vps/import-ledger.mjs /root/bnb-ledger-XXXX.json

  3. CLOSE the bot's tab on your PC first (one account can't be in two places), then:
     systemctl start farmhand
     journalctl -u farmhand -f        (watch it log in; Ctrl+C stops watching, not the bot)
DONE
