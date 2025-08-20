const express = require('express');
const cors = require('cors');
const path = require('path');
const { body, validationResult } = require('express-validator');
const db = require('./db');
const TelegramBot = require('node-telegram-bot-api');
const http = require('http');
require('dotenv').config();

// Simple logging
const logger = {
  info: console.log,
  error: console.error,
  warn: console.warn
};

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors({ origin: process.env.NODE_ENV === 'production' ? 'https://zufariy.uz' : '*' }));
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  logger.info({ method: req.method, url: req.url, ip: req.ip }, 'Incoming request');
  next();
});

// Telegram Bot Setup
const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID || '1234567890'; // Sizning Telegram chat ID'ingiz

if (process.env.NODE_ENV !== 'production') {
  console.log('🔍 Debug: BOT_TOKEN =', BOT_TOKEN ? 'MAVJUD' : 'YO\'Q');
  console.log('🔍 Debug: CHAT_ID =', CHAT_ID);
}

let bot = null;
if (BOT_TOKEN && BOT_TOKEN !== 'YOUR_BOT_TOKEN_HERE' && BOT_TOKEN.trim() !== '') {
  try {
    bot = new TelegramBot(BOT_TOKEN, { polling: true });
    console.log('🤖 Telegram bot faol');
  } catch (error) {
    console.log('⚠️ Bot token noto\'g\'ri:', error.message);
    bot = null;
  }
} else {
  console.log('⚠️ Bot token yo\'q yoki noto\'g\'ri, faqat Formspree ishlatiladi');
}

// Persistent storage using SQLite (db.js). The table is created on first run.
let messageId = 1; // kept for compatibility, but DB auto‑increments IDs

// Bot commands (faqat bot mavjud bo'lsa)
if (bot) {
  bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, `
🤖 *Zufarbek Portfolio Bot*

Salom! Men Zufarbek ning portfolio botiman.

📝 *Mavjud buyruqlar:*
/start - Botni ishga tushirish
/help - Yordam
/messages - Barcha xabarlarni ko'rish
/reply [id] [xabar] - Xabarga javob berish

💼 Portfolio: zufariy.uz
    `, { parse_mode: 'Markdown' });
  });

  bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, `
📋 *Yordam*

🔹 */messages* - Barcha kelgan xabarlarni ko'rish
🔹 */reply [id] [xabar]* - Muayyan xabarga javob berish

*Misol:*
\`/reply 1 Rahmat, tez orada javob beraman!\`

📞 *Aloqa:*
- Portfolio: zufariy.uz
- Telegram: @Zufar_Xorazmiy
    `, { parse_mode: 'Markdown' });
  });

  bot.onText(/\/messages/, async (msg) => {
  const chatId = msg.chat.id;
  try {
    const recent = await db.getRecentMessages(10);
    if (recent.length === 0) {
      await bot.sendMessage(chatId, '📭 Hozircha xabarlar yo\'q.');
      return;
    }
    let messageText = '📨 *Kelgan xabarlar:*\n\n';
    recent.forEach(message => {
      messageText += `🆔 *ID:* ${message.id}\n`;
      messageText += `👤 *Ism:* ${message.name}\n`;
      messageText += `📧 *Email:* ${message.email}\n`;
      messageText += `💬 *Xabar:* ${message.message}\n`;
      messageText += `⏰ *Vaqt:* ${message.timestamp}\n`;
      messageText += `${message.replied ? '✅ Javob berilgan' : '⏳ Javob kutilmoqda'}\n`;
      messageText += '─────────────────\n\n';
    });
    await bot.sendMessage(chatId, messageText, { parse_mode: 'Markdown' });
  } catch (err) {
    console.error('Bot /messages error:', err);
    await bot.sendMessage(chatId, '⚠️ Xabarlarni olishda xatolik yuz berdi.');
  }
});

  bot.onText(/\/reply (\d+) (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const messageIdToReply = parseInt(match[1]);
    const replyText = match[2];
    try {
      const message = await db.getMessageById(messageIdToReply);
      if (!message) {
        await bot.sendMessage(chatId, `❌ ${messageIdToReply} ID li xabar topilmadi.`);
        return;
      }
      if (message.replied) {
        await bot.sendMessage(chatId, `⚠️ Bu xabarga allaqachon javob berilgan.`);
        return;
      }
      // Update DB
      await db.markReplied(messageIdToReply, replyText);
      // Send confirmation
      await bot.sendMessage(chatId, `
✅ *Javob yuborildi!*

🆔 *Xabar ID:* ${messageIdToReply}
👤 *Kimga:* ${message.name} (${message.email})
💬 *Javob:* ${replyText}

📧 Javob email orqali yuboriladi.
      `, { parse_mode: 'Markdown' });
    } catch (err) {
      console.error('Bot /reply error:', err);
      await bot.sendMessage(chatId, '⚠️ Javob yuborishda xatolik yuz berdi.');
    }
  });
}

// API Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Zufarbek Portfolio Bot API',
    status: 'active',
    endpoints: {
      'POST /api/contact': 'Send contact message',
      'GET /api/messages': 'Get all messages',
      'POST /api/reply': 'Reply to message'
    }
  });
});

// Contact form endpoint
app.post('/api/contact',
  [
    body('name').trim().isLength({ min: 1 }).withMessage('Name required'),
    body('email').isEmail().withMessage('Valid email required'),
    body('message').trim().isLength({ min: 1 }).withMessage('Message required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, error: errors.array()[0].msg });
    }
    try {
      const { name, email, message } = req.body;
      // Create message object (no manual id)
      const newMessage = {
        name,
        email,
        message,
        timestamp: new Date().toLocaleString('uz-UZ'),
        replied: false
      };
      const insertedId = await db.addMessage(newMessage);
      newMessage.id = insertedId;
      // Send to Telegram (faqat bot mavjud bo'lsa)
      if (bot) {
        const telegramMessage = `
🔔 *Yangi xabar keldi!*\n\n🆔 *ID:* ${newMessage.id}\n👤 *Ism:* ${name}\n📧 *Email:* ${email}\n💬 *Xabar:* ${message}\n⏰ *Vaqt:* ${newMessage.timestamp}\n\n📝 *Javob berish uchun:*\n\`/reply ${newMessage.id} [sizning javobingiz]\`\n        `;
        await bot.sendMessage(CHAT_ID, telegramMessage, { parse_mode: 'Markdown' });
      }
      res.json({ success: true, message: 'Xabar muvaffaqiyatli yuborildi!', messageId: newMessage.id });
    } catch (error) {
      console.error('Contact form error:', error);
      res.status(500).json({ success: false, error: 'Server xatosi yuz berdi' });
    }
  }
);

// Get all messages
app.get('/api/messages', (req, res) => {
  const recent = db.getRecentMessages(50);
  res.json({
    success: true,
    messages: recent
  });
});

// Reply to message
app.post('/api/reply', async (req, res) => {
  try {
    const { messageId, replyText } = req.body;
    const id = parseInt(messageId);
    const existing = await db.getMessageById(id);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Xabar topilmadi' });
    }
    await db.markReplied(id, replyText);
    res.json({ success: true, message: 'Javob muvaffaqiyatli yuborildi' });
  } catch (error) {
    console.error('Reply error:', error);
    res.status(500).json({ success: false, error: 'Server xatosi yuz berdi' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    error: 'Server xatosi yuz berdi' 
  });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..', 'build')));

  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
  });
}

// Health check endpoint for load balancer
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

const PORT = process.env.PORT || 5000;

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Server ${PORT} portda ishlamoqda`);
  console.log(`🤖 Telegram bot ${bot ? 'faol' : 'faol emas'}`);
  console.log(`📧 Contact API: http://localhost:${PORT}/api/contact`);
});

// Handle bot errors (faqat bot mavjud bo'lsa)
if (bot) {
  bot.on('error', (error) => {
    console.error('Bot error:', error);
  });
}

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('🛑 Server to\'xtatilmoqda...');
  if (bot) {
    bot.stopPolling();
  }
  process.exit(0);
});
