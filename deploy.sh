#!/usr/bin/env bash
set -euo pipefail

REMOTE_HOST="PersonalVPS"
REMOTE_DIR="/var/www/beauty-centre"

echo "==> Building locally..."
npm run build

echo ""
echo "==> Restarting PM2 on $REMOTE_HOST..."
ssh "$REMOTE_HOST" bash -s <<-REMOTESCRIPT
  set -euo pipefail

  export NVM_DIR="\$HOME/.nvm"
  [ -s "\$NVM_DIR/nvm.sh" ] && source "\$NVM_DIR/nvm.sh"

  cd "$REMOTE_DIR"

  if pm2 describe beauty-centre &>/dev/null; then
    pm2 restart beauty-centre 2>&1
  else
    pm2 start ecosystem.config.js 2>&1
  fi
  pm2 save 2>&1
  echo "    Done."
REMOTESCRIPT

echo ""
echo "==> Deploy complete."
