#!/bin/bash

# Zufariy.uz Deploy Script with SSL
# Bu script loyihani VPS'ga deploy qiladi va SSL sertifikat o'rnatadi

echo "🚀 Zufariy.uz Deploy Script"
echo "=========================="

# 1. PM2 o'rnatish (agar o'rnatilmagan bo'lsa)
echo "📦 Installing PM2..."
sudo npm install -g pm2 2>/dev/null || true

# 2. Loyihani build qilish
echo "📦 Building project..."
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build

# 2. PM2 bilan serverni to'xtatish (agar ishlab turgan bo'lsa)
echo "🛑 Stopping existing server..."
pm2 stop zufariy-server 2>/dev/null || true
pm2 delete zufariy-server 2>/dev/null || true

# 3. Yangi serverni ishga tushirish
echo "🚀 Starting server with PM2..."
pm2 start server/index.js --name "zufariy-server" --env production

# 4. Nginx konfiguratsiyasini yangilash
echo "🔧 Updating Nginx configuration..."
sudo tee /etc/nginx/sites-available/zufariy.uz > /dev/null <<EOF
server {
    listen 80;
    server_name zufariy.uz www.zufariy.uz;
    
    # HTTP dan HTTPS ga yo'naltirish
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name zufariy.uz www.zufariy.uz;
    
    # SSL sertifikatlar
    ssl_certificate /etc/letsencrypt/live/zufariy.uz/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/zufariy.uz/privkey.pem;
    
    # SSL sozlamalari
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options DENY always;
    add_header X-Content-Type-Options nosniff always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # Frontend (React build)
    location / {
        root /var/www/zufariy.uz/build;
        try_files \$uri \$uri/ /index.html;
        
        # Cache static files
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # Backend API
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# 5. Nginx konfiguratsiyasini faollashtirish
sudo ln -sf /etc/nginx/sites-available/zufariy.uz /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# 6. PM2 ni avtomatik ishga tushirish uchun sozlash
pm2 save
pm2 startup

echo "✅ Deploy completed!"
echo "🌐 Website: https://zufariy.uz"
echo "📊 PM2 status: pm2 status"
echo "📝 Logs: pm2 logs zufariy-server"
