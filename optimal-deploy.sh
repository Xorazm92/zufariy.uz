#!/bin/bash

# Optimal deployment script for zufariy.uz
# Serverda kam joy egallashi uchun optimizatsiya qilingan

set -e

echo "🚀 Optimal deployment boshlandi..."

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

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json topilmadi. Loyiha papkasida ekanligingizni tekshiring."
    exit 1
fi

# Create logs directory if it doesn't exist
mkdir -p logs

# Clean previous builds and cache
print_status "Eski build va cache tozalanmoqda..."
rm -rf build/
rm -rf node_modules/.cache/
npm cache clean --force

# Install only production dependencies
print_status "Production dependencies o'rnatilmoqda..."
NODE_ENV=production npm ci --only=production --no-audit --no-fund

# Install dev dependencies needed for build
print_status "Build uchun dev dependencies o'rnatilmoqda..."
npm install --only=dev react-scripts webpack-bundle-analyzer

# Build the application with optimizations
print_status "Optimizatsiya bilan build qilinmoqda..."
NODE_ENV=production \
GENERATE_SOURCEMAP=false \
INLINE_RUNTIME_CHUNK=false \
NODE_OPTIONS='--max-old-space-size=2048' \
npm run build

# Check build size
BUILD_SIZE=$(du -sh build/ | cut -f1)
print_success "Build yaratildi. Hajmi: $BUILD_SIZE"

# Remove dev dependencies to save space
print_status "Dev dependencies olib tashlanmoqda..."
npm prune --production

# Optimize build further
print_status "Build qo'shimcha optimizatsiya qilinmoqda..."

# Remove unnecessary files from build
find build/ -name "*.map" -delete
find build/ -name "*.txt" -not -name "robots.txt" -delete

# Compress static files if gzip is available
if command -v gzip &> /dev/null; then
    print_status "Static fayllar siqilmoqda..."
    find build/static -name "*.js" -exec gzip -9 -k {} \;
    find build/static -name "*.css" -exec gzip -9 -k {} \;
fi

# Final build size
FINAL_SIZE=$(du -sh build/ | cut -f1)
print_success "Optimizatsiya tugadi. Yakuniy hajmi: $FINAL_SIZE"

# Stop existing PM2 processes
print_status "Mavjud PM2 jarayonlar to'xtatilmoqda..."
pm2 stop ecosystem.config.js || true

# Start the application
print_status "Ilova ishga tushirilmoqda..."
pm2 start ecosystem.config.js --env production

# Show status
pm2 status

print_success "✅ Optimal deployment muvaffaqiyatli tugadi!"
print_status "📊 Statistika:"
echo "   - Build hajmi: $FINAL_SIZE"
echo "   - Node modules: $(du -sh node_modules/ | cut -f1)"
echo "   - Jami hajmi: $(du -sh . --exclude=node_modules | cut -f1)"

print_status "🔗 Linklar:"
echo "   - Website: https://zufariy.uz"
echo "   - API: https://zufariy.uz/api/health"
echo "   - PM2 monitoring: pm2 monit"

print_warning "💡 Keyingi qadamlar:"
echo "   - SSL sertifikatini yangilang: sudo certbot renew"
echo "   - Nginx konfiguratsiyasini tekshiring"
echo "   - Backup yarating: ./backup.sh"
