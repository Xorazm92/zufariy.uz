#!/bin/bash

echo "🚀 Minimal Deploy for Zufariy.uz"
echo "================================"

# 1. Backup current package.json
cp package.json package.json.backup

# 2. Use minimal package.json
cp package-minimal.json package.json

# 3. Clean install
rm -rf node_modules package-lock.json
npm install

# 4. Stop existing server
pm2 stop zufariy-server 2>/dev/null || true
pm2 delete zufariy-server 2>/dev/null || true

# 5. Start minimal server
pm2 start server/minimal-server.js --name "zufariy-server"

# 6. Save PM2 config
pm2 save

# 7. Show status
pm2 status
pm2 logs zufariy-server --lines 3

echo "✅ Minimal deploy completed!"
echo "📊 Check size: du -sh node_modules"
