#!/bin/bash

# Production Deploy Script for Zufariy.uz
# Bu script GitHub'dan pull qilgandan keyin avtomatik deploy qiladi

set -e  # Exit on any error

echo "🚀 Zufariy.uz Production Deploy"
echo "==============================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 1. Git pull latest changes
print_status "Pulling latest changes from GitHub..."
git pull origin main || {
    print_error "Git pull failed!"
    exit 1
}

# 2. Install/update dependencies
print_status "Installing dependencies..."
npm install || {
    print_error "npm install failed!"
    exit 1
}

# 3. Stop existing PM2 process
print_status "Stopping existing server..."
pm2 stop zufariy-server 2>/dev/null || print_warning "Server was not running"
pm2 delete zufariy-server 2>/dev/null || print_warning "No existing process to delete"

# 4. Build project with increased memory
print_status "Building project..."
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build || {
    print_error "Build failed!"
    exit 1
}

# 5. Copy environment variables
print_status "Setting up environment..."
if [ -f ".env.production" ]; then
    cp .env.production .env
    print_success "Environment variables copied"
else
    print_warning ".env.production not found, using existing .env"
fi

# 6. Start server with PM2
print_status "Starting server..."
pm2 start server/index.js --name "zufariy-server" --env production || {
    print_error "Failed to start server!"
    exit 1
}

# 7. Save PM2 configuration
pm2 save

# 8. Setup PM2 startup (if not already done)
pm2 startup 2>/dev/null || print_warning "PM2 startup already configured"

# 9. Check server status
print_status "Checking server status..."
sleep 3
pm2 status

# 10. Test API endpoint
print_status "Testing API..."
if curl -f http://localhost:5000/api/health > /dev/null 2>&1; then
    print_success "API is responding"
else
    print_warning "API test failed, but server might still be starting"
fi

# 11. Show logs
print_status "Recent logs:"
pm2 logs zufariy-server --lines 5

print_success "Deploy completed successfully!"
echo ""
echo "🌐 Website: https://zufariy.uz"
echo "📊 PM2 status: pm2 status"
echo "📝 View logs: pm2 logs zufariy-server"
echo "🔄 Restart: pm2 restart zufariy-server"
