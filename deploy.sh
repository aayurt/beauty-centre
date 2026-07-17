#!/usr/bin/env bash
set -euo pipefail

REMOTE_HOST="PersonalVPS"
REMOTE_DIR="/var/www/beauty-centre"
LOCAL_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "==> Building locally..."
npm run build

echo ""
echo "==> Syncing to $REMOTE_HOST:$REMOTE_DIR..."
rsync -avz --delete \
  --exclude '.next/cache' \
  --exclude '.next/dev' \
  --exclude '.next/standalone' \
  --exclude 'node_modules' \
  --exclude '.git' \
  --exclude '.env*' \
  --exclude '*.tsbuildinfo' \
  "$LOCAL_DIR/.next" \
  "$LOCAL_DIR/public" \
  "$LOCAL_DIR/package.json" \
  "$LOCAL_DIR/package-lock.json" \
  "$LOCAL_DIR/next.config.ts" \
  "$LOCAL_DIR/ecosystem.config.js" \
  "$LOCAL_DIR/prisma" \
  "$REMOTE_HOST:$REMOTE_DIR/"

echo ""
echo "==> Installing deps & restarting on $REMOTE_HOST..."
ssh "$REMOTE_HOST" bash -s <<-REMOTESCRIPT
  set -euo pipefail

  export NVM_DIR="\$HOME/.nvm"
  [ -s "\$NVM_DIR/nvm.sh" ] && source "\$NVM_DIR/nvm.sh"

  cd "$REMOTE_DIR"

  npm install --production 2>&1
  echo "    Dependencies installed."

  npx prisma generate 2>&1
  npx prisma migrate deploy 2>&1 || echo "    [SKIP] DB already has schema."

  if pm2 describe beauty-centre &>/dev/null; then
    pm2 restart beauty-centre 2>&1
  else
    pm2 start ecosystem.config.js 2>&1
  fi
  pm2 save 2>&1
  echo "    Deploy complete."
REMOTESCRIPT

echo ""
echo "==> Done."
