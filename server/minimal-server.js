const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "https://api.zufariy.uz"]
    }
  }
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests, please try again later.' }
});
app.use(limiter);

// Contact form specific rate limiting
const contactLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 3, // limit each IP to 3 contact form submissions per minute
  message: { error: 'Too many contact form submissions, please wait.' }
});

// Basic middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://zufariy.uz', 'https://www.zufariy.uz']
    : '*',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Telegram Bot (optional)
let bot = null;
const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

if (BOT_TOKEN && BOT_TOKEN !== 'your_telegram_bot_token_here') {
  try {
    const TelegramBot = require('node-telegram-bot-api');
    bot = new TelegramBot(BOT_TOKEN, { 
      polling: true,
      polling_options: {
        timeout: 10,
        limit: 100,
        retryTimeout: 5000
      }
    });
    
    // Polling error-larni suppress qilish
    bot.on('polling_error', (error) => {
      if (error.code !== 'ETELEGRAM' && error.code !== 'ECONNRESET') {
        console.log('⚠️ Telegram polling error:', error.message);
      }
    });
    
    console.log('✅ Telegram bot connected');
  } catch (error) {
    console.log('⚠️ Telegram bot error:', error.message);
  }
}

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Zufariy.uz API', 
    status: 'active',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    timestamp: new Date().toISOString()
  });
});

app.post('/api/contact', contactLimiter, async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Input validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'All fields required'
      });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      });
    }

    // Length validation
    if (name.length > 100 || email.length > 100 || message.length > 1000) {
      return res.status(400).json({
        success: false,
        error: 'Input too long'
      });
    }

    console.log('📧 New contact:', {
      name: name.substring(0, 50),
      email: email.substring(0, 50),
      message: message.substring(0, 100) + '...'
    });

    // Send to Telegram if available
    if (bot && CHAT_ID) {
      const telegramMessage = `
🔔 New Contact Message

👤 Name: ${name}
📧 Email: ${email}
💬 Message: ${message}
⏰ Time: ${new Date().toLocaleString('uz-UZ')}
🌐 IP: ${req.ip}
      `;

      try {
        await bot.sendMessage(CHAT_ID, telegramMessage);
      } catch (error) {
        console.log('Telegram send error:', error.message);
      }
    }

    res.json({
      success: true,
      message: 'Xabar muvaffaqiyatli yuborildi!'
    });

  } catch (error) {
    console.error('Contact error:', error);
    res.status(500).json({
      success: false,
      error: 'Server xatosi yuz berdi'
    });
  }
});

// Serve static files with caching (if build exists)
if (process.env.NODE_ENV === 'production') {
  const buildPath = path.join(__dirname, '..', 'build');

  // Static files with long-term caching
  app.use('/static', express.static(path.join(buildPath, 'static'), {
    maxAge: '1y',
    etag: true,
    lastModified: true
  }));

  // Other assets with shorter caching
  app.use(express.static(buildPath, {
    maxAge: '1d',
    etag: true,
    lastModified: true
  }));

  // SPA fallback
  app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🤖 Telegram bot: ${bot ? 'connected' : 'disabled'}`);
  console.log(`📡 API: http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('🛑 Shutting down server...');
  if (bot) {
    bot.stopPolling();
  }
  process.exit(0);
});
