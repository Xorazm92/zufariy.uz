#!/bin/bash

# Quick Deploy Script - faqat server restart
# Build qilmasdan faqat server kodini yangilash uchun

echo "⚡ Quick Deploy - Server Only"
echo "============================="

# Pull latest changes
echo "📥 Pulling changes..."
git pull origin main

# Copy environment
if [ -f ".env.production" ]; then
    cp .env.production .env
fi

# Restart server
echo "🔄 Restarting server..."
pm2 restart zufariy-server

# Show status
echo "📊 Status:"
pm2 status
pm2 logs zufariy-server --lines 3

echo "✅ Quick deploy completed!"
