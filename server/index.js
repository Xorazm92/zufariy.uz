const express = require('express');
const cors = require('cors');
const path = require('path');
const TelegramBot = require('node-telegram-bot-api');
const http = require('http');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// Telegram Bot Setup
const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID || '1234567890'; // Sizning Telegram chat ID'ingiz

console.log('🔍 Debug: BOT_TOKEN =', BOT_TOKEN ? 'MAVJUD' : 'YO\'Q');
console.log('🔍 Debug: CHAT_ID =', CHAT_ID);

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

// In-memory storage for messages (production da database ishlatish kerak)
let messages = [];
let messageId = 1;

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

  bot.onText(/\/messages/, (msg) => {
  const chatId = msg.chat.id;
  
  if (messages.length === 0) {
    bot.sendMessage(chatId, '📭 Hozircha xabarlar yo\'q.');
    return;
  }

  let messageText = '📨 *Kelgan xabarlar:*\n\n';
  messages.slice(-10).forEach(message => {
    messageText += `🆔 *ID:* ${message.id}\n`;
    messageText += `👤 *Ism:* ${message.name}\n`;
    messageText += `📧 *Email:* ${message.email}\n`;
    messageText += `💬 *Xabar:* ${message.message}\n`;
    messageText += `⏰ *Vaqt:* ${message.timestamp}\n`;
    messageText += `${message.replied ? '✅ Javob berilgan' : '⏳ Javob kutilmoqda'}\n`;
    messageText += '─────────────────\n\n';
  });

    bot.sendMessage(chatId, messageText, { parse_mode: 'Markdown' });
  });

  bot.onText(/\/reply (\d+) (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const messageIdToReply = parseInt(match[1]);
    const replyText = match[2];

    const message = messages.find(m => m.id === messageIdToReply);

    if (!message) {
      bot.sendMessage(chatId, `❌ ${messageIdToReply} ID li xabar topilmadi.`);
      return;
    }

    if (message.replied) {
      bot.sendMessage(chatId, `⚠️ Bu xabarga allaqachon javob berilgan.`);
      return;
    }

    // Mark as replied
    message.replied = true;
    message.replyText = replyText;
    message.replyTime = new Date().toLocaleString('uz-UZ');

    bot.sendMessage(chatId, `
✅ *Javob yuborildi!*

🆔 *Xabar ID:* ${messageIdToReply}
👤 *Kimga:* ${message.name} (${message.email})
💬 *Javob:* ${replyText}

📧 Javob email orqali yuboriladi.
    `, { parse_mode: 'Markdown' });
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
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ 
        success: false, 
        error: 'Barcha maydonlar to\'ldirilishi shart' 
      });
    }

    // Create message object
    const newMessage = {
      id: messageId++,
      name,
      email,
      message,
      timestamp: new Date().toLocaleString('uz-UZ'),
      replied: false
    };

    messages.push(newMessage);

    // Send to Telegram (faqat bot mavjud bo'lsa)
    if (bot) {
      const telegramMessage = `
🔔 *Yangi xabar keldi!*

🆔 *ID:* ${newMessage.id}
👤 *Ism:* ${name}
📧 *Email:* ${email}
💬 *Xabar:* ${message}
⏰ *Vaqt:* ${newMessage.timestamp}

📝 *Javob berish uchun:*
\`/reply ${newMessage.id} [sizning javobingiz]\`
      `;

      await bot.sendMessage(CHAT_ID, telegramMessage, { parse_mode: 'Markdown' });
    }

    res.json({ 
      success: true, 
      message: 'Xabar muvaffaqiyatli yuborildi!',
      messageId: newMessage.id
    });

  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server xatosi yuz berdi' 
    });
  }
});

// Get all messages
app.get('/api/messages', (req, res) => {
  res.json({ 
    success: true, 
    messages: messages.slice(-50) // Last 50 messages
  });
});

// Reply to message
app.post('/api/reply', async (req, res) => {
  try {
    const { messageId, replyText } = req.body;

    const message = messages.find(m => m.id === parseInt(messageId));
    
    if (!message) {
      return res.status(404).json({ 
        success: false, 
        error: 'Xabar topilmadi' 
      });
    }

    message.replied = true;
    message.replyText = replyText;
    message.replyTime = new Date().toLocaleString('uz-UZ');

    res.json({ 
      success: true, 
      message: 'Javob muvaffaqiyatli yuborildi' 
    });

  } catch (error) {
    console.error('Reply error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server xatosi yuz berdi' 
    });
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

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
  });
}

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
