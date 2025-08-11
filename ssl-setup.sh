#!/bin/bash

# SSL Sertifikat O'rnatish Script (Let's Encrypt)
# Bu script zufariy.uz uchun bepul SSL sertifikat o'rnatadi

echo "🔐 SSL Sertifikat O'rnatish"
echo "========================="

# 1. Certbot o'rnatish (Ubuntu/Debian)
echo "📦 Installing Certbot..."
sudo apt update
sudo apt install -y certbot python3-certbot-nginx

# 2. Nginx o'rnatish (agar o'rnatilmagan bo'lsa)
echo "🔧 Installing Nginx..."
sudo apt install -y nginx

# 3. Firewall sozlash
echo "🔥 Configuring firewall..."
sudo ufw allow 'Nginx Full'
sudo ufw allow ssh
sudo ufw --force enable

# 4. Nginx ni ishga tushirish
echo "🚀 Starting Nginx..."
sudo systemctl start nginx
sudo systemctl enable nginx

# 5. Dastlabki Nginx konfiguratsiyasi (SSL olishdan oldin)
echo "⚙️ Creating initial Nginx config..."
sudo tee /etc/nginx/sites-available/zufariy.uz > /dev/null <<EOF
server {
    listen 80;
    server_name zufariy.uz www.zufariy.uz;
    
    location / {
        root /var/www/zufariy.uz/build;
        try_files \$uri \$uri/ /index.html;
    }
    
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

# 6. Nginx konfiguratsiyasini faollashtirish
sudo ln -sf /etc/nginx/sites-available/zufariy.uz /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx

# 7. Web root yaratish
echo "📁 Creating web root..."
sudo mkdir -p /var/www/zufariy.uz
sudo chown -R $USER:$USER /var/www/zufariy.uz

# 8. SSL sertifikat olish
echo "🔐 Obtaining SSL certificate..."
echo "DIQQAT: Domain zufariy.uz sizning serveringizga yo'naltirilgan bo'lishi kerak!"
read -p "Davom etishga tayyormisiz? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    sudo certbot --nginx -d zufariy.uz -d www.zufariy.uz --non-interactive --agree-tos --email your-email@example.com
    
    # 9. Avtomatik yangilanish sozlash
    echo "🔄 Setting up auto-renewal..."
    sudo systemctl enable certbot.timer
    sudo systemctl start certbot.timer
    
    # 10. Cron job qo'shish (qo'shimcha himoya)
    (crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | crontab -
    
    echo "✅ SSL sertifikat muvaffaqiyatli o'rnatildi!"
    echo "🌐 Saytingiz: https://zufariy.uz"
    echo "🔍 Sertifikat holati: sudo certbot certificates"
    echo "🔄 Yangilanishni tekshirish: sudo certbot renew --dry-run"
else
    echo "❌ SSL o'rnatish bekor qilindi"
fi

# 11. Status tekshirish
echo "📊 System Status:"
echo "Nginx: $(sudo systemctl is-active nginx)"
echo "Certbot timer: $(sudo systemctl is-active certbot.timer)"
sudo certbot certificates 2>/dev/null || echo "SSL sertifikat hali o'rnatilmagan"
