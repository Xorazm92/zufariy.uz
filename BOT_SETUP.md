# 🤖 Telegram Bot Setup Guide

Bu guide sizga Telegram bot integratsiyasini sozlashda yordam beradi.

## 📋 Kerakli Qadamlar

### 1. Telegram Bot Yaratish

1. Telegram'da [@BotFather](https://t.me/BotFather) ga boring
2. `/newbot` buyrug'ini yuboring
3. Bot nomi va username'ini kiriting (masalan: `ZufarPortfolioBot`)
4. Bot token'ini oling va `.env` faylga qo'ying

### 2. Chat ID Olish

Sizning shaxsiy chat ID'ingizni olish uchun:

1. [@userinfobot](https://t.me/userinfobot) ga boring
2. `/start` buyrug'ini yuboring
3. Bot sizga chat ID'ingizni beradi
4. Bu ID'ni `.env` faylda `CHAT_ID` ga qo'ying

### 3. Environment Variables

`.env` faylni to'ldiring:

```env
GENERATE_SOURCEMAP=false
BOT_TOKEN=6993732913:AAEZDciikC2Mj3bnxr6ZFyatwGTBGfl9k_E
CHAT_ID=YOUR_TELEGRAM_CHAT_ID  # Bu yerga o'z chat ID'ingizni qo'ying
REACT_APP_API_URL=http://localhost:5000
```

### 4. Serverni Ishga Tushirish

```bash
# Backend va frontend'ni birga ishga tushirish
npm run dev

# Yoki alohida ishga tushirish:
# Backend
npm run server

# Frontend (boshqa terminal'da)
npm start
```

## 🚀 Qanday Ishlaydi

### Contact Form → Bot Integration

1. **Foydalanuvchi contact form'ni to'ldiradi**
2. **Frontend API'ga POST request yuboradi** (`/api/contact`)
3. **Backend xabarni Telegram bot orqali sizga yuboradi**
4. **Siz bot orqali javob berasiz** (`/reply [id] [javob]`)

### Bot Commands

- `/start` - Botni ishga tushirish
- `/help` - Yordam
- `/messages` - Barcha xabarlarni ko'rish
- `/reply [id] [xabar]` - Xabarga javob berish

**Misol:**
```
/reply 1 Rahmat, tez orada javob beraman!
```

### Admin Panel

Admin panel orqali ham xabarlarni boshqarishingiz mumkin:
- URL: `http://localhost:3000/admin`
- Real-time xabarlar ro'yxati
- GUI orqali javob berish
- Auto-refresh har 30 soniyada

## 📱 Bot Features

### ✅ Implemented Features

- ✅ Contact form integration
- ✅ Real-time message notifications
- ✅ Reply system via bot commands
- ✅ Admin panel GUI
- ✅ Message status tracking
- ✅ Auto-refresh functionality

### 🔄 Message Flow

```
Contact Form → API → Telegram Bot → You
     ↑                                ↓
   User                           Your Reply
```

## 🛠️ Troubleshooting

### Bot Token Issues
- Bot token noto'g'ri bo'lsa, server error beradi
- Token'ni [@BotFather](https://t.me/BotFather) dan qayta oling

### Chat ID Issues
- Chat ID noto'g'ri bo'lsa, xabarlar kelmaydi
- [@userinfobot](https://t.me/userinfobot) dan to'g'ri ID oling

### Server Issues
- Port 5000 band bo'lsa, `.env` da `PORT=5001` qo'shing
- CORS issues bo'lsa, backend'da CORS sozlamalari tekshiring

## 📞 Support

Agar muammolar bo'lsa:
- GitHub Issues: [Repository Issues](https://github.com/Xorazm92/zufariy.uz/issues)
- Telegram: [@Zufar_Xorazmiy](https://t.me/Zufar_Xorazmiy)

## 🔐 Security Notes

- Bot token'ini hech kimga bermang
- Production'da environment variables'ni secure qiling
- HTTPS ishlatishni unutmang production'da

## 🚀 Production Deployment

Production'da deploy qilish uchun:

1. **Environment Variables**:
   ```env
   BOT_TOKEN=your_production_bot_token
   CHAT_ID=your_chat_id
   REACT_APP_API_URL=https://yourdomain.com
   PORT=5000
   ```

2. **Webhook Setup** (optional):
   ```javascript
   // Polling o'rniga webhook ishlatish
   bot.setWebHook('https://yourdomain.com/webhook');
   ```

3. **Process Manager**:
   ```bash
   # PM2 bilan ishga tushirish
   pm2 start server/index.js --name "portfolio-bot"
   ```

## 📊 Analytics

Bot orqali kelgan xabarlar statistikasi:
- Jami xabarlar soni
- Javob berilgan xabarlar
- Response time
- Popular contact times

---

**Muvaffaqiyatli setup!** 🎉

Endi sizning portfolio saytingiz Telegram bot bilan to'liq integratsiya qilingan va siz real-time xabarlar olasiz!
