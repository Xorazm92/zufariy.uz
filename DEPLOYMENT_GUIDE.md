# 🚀 Zufariy.uz Production Deploy Yo'riqnomasi

Bu yo'riqnoma sizga GitHub'dan pull qilgandan keyin avtomatik deploy qilishda yordam beradi.

## ⚡ Tezkor Deploy (SSL allaqachon sozlangan)

### Avtomatik Deploy
```bash
# To'liq deploy (build + restart)
./production-deploy.sh

# Tezkor deploy (faqat server restart)
./quick-deploy.sh

# NPM script orqali
npm run prod-deploy
npm run quick-deploy
```

## 📋 Tayyorgarlik

### 1. Domain Sozlash
- `zufariy.uz` domenini serveringizning IP manziliga yo'naltiring
- DNS A record: `zufariy.uz` → `YOUR_SERVER_IP`
- DNS A record: `www.zufariy.uz` → `YOUR_SERVER_IP`

### 2. Server Talablari
- Ubuntu 20.04+ yoki Debian 10+
- 1GB+ RAM
- Node.js 16+
- Nginx
- PM2

## 🎯 Deploy Variantlari

### Variant 1: Vercel (Eng Oson) ⭐

1. **Vercel CLI o'rnatish:**
```bash
npm i -g vercel
```

2. **Deploy qilish:**
```bash
vercel --prod
```

3. **Domain sozlash:**
- Vercel dashboard'da domain qo'shish
- DNS sozlamalari avtomatik

### Variant 2: VPS (To'liq Nazorat)

#### 1. Server Tayyorlash

```bash
# Server yangilash
sudo apt update && sudo apt upgrade -y

# Node.js o'rnatish
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# PM2 o'rnatish
sudo npm install -g pm2

# Git o'rnatish
sudo apt install -y git
```

#### 2. Loyihani Klonlash

```bash
# Web root yaratish
sudo mkdir -p /var/www/zufariy.uz
sudo chown -R $USER:$USER /var/www/zufariy.uz

# Loyihani klonlash
cd /var/www/zufariy.uz
git clone https://github.com/Xorazm92/zufariy.uz.git .

# Dependencies o'rnatish
npm install
```

#### 3. SSL Sertifikat O'rnatish

```bash
# SSL setup script'ni ishga tushirish
chmod +x ssl-setup.sh
./ssl-setup.sh
```

#### 4. Production Deploy

```bash
# Environment variables sozlash
cp .env.production .env

# Build va deploy
chmod +x deploy.sh
./deploy.sh
```

### Variant 3: Netlify + Railway

#### Frontend (Netlify):
1. GitHub repository'ni Netlify'ga ulang
2. Build command: `npm run build`
3. Publish directory: `build`
4. Domain sozlamalari avtomatik

#### Backend (Railway):
1. Railway'da yangi project yarating
2. GitHub repository'ni ulang
3. Environment variables qo'shing
4. Deploy avtomatik

## 🔧 Environment Variables

Production uchun kerakli environment variables:

```env
NODE_ENV=production
PORT=5000
BOT_TOKEN=your_telegram_bot_token
CHAT_ID=your_telegram_chat_id
REACT_APP_API_URL=https://zufariy.uz
```

## 🔐 SSL Sertifikat Boshqaruvi

### Sertifikat Holati Tekshirish
```bash
sudo certbot certificates
```

### Sertifikatni Yangilash
```bash
sudo certbot renew
```

### Avtomatik Yangilanish Tekshirish
```bash
sudo certbot renew --dry-run
```

## 📊 Monitoring va Logs

### PM2 Commands
```bash
# Status ko'rish
pm2 status

# Logs ko'rish
pm2 logs zufariy-server

# Restart qilish
pm2 restart zufariy-server

# Stop qilish
pm2 stop zufariy-server
```

### Nginx Commands
```bash
# Status tekshirish
sudo systemctl status nginx

# Restart qilish
sudo systemctl restart nginx

# Logs ko'rish
sudo tail -f /var/log/nginx/error.log
```

## 🚨 Troubleshooting

### SSL Muammolari
- Domain DNS sozlamalarini tekshiring
- Firewall portlarini tekshiring (80, 443)
- Certbot logs: `sudo journalctl -u certbot`

### Server Muammolari
- PM2 logs tekshiring: `pm2 logs`
- Nginx error logs: `sudo tail -f /var/log/nginx/error.log`
- Server resources: `htop` yoki `free -h`

### Bot Muammolari
- BOT_TOKEN to'g'riligini tekshiring
- CHAT_ID to'g'riligini tekshiring
- Telegram API status: https://status.telegram.org/

## 🔄 Yangilanishlar

### Code Yangilash
```bash
cd /var/www/zufariy.uz
git pull origin main
npm install
npm run build
pm2 restart zufariy-server
```

### Dependencies Yangilash
```bash
npm update
npm audit fix
```

## 📞 Yordam

Muammolar bo'lsa:
- GitHub Issues: https://github.com/Xorazm92/zufariy.uz/issues
- Telegram: @Zufar_Xorazmiy

---

**Muvaffaqiyatli deploy!** 🎉
