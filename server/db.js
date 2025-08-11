// SQLite helper for persistent message storage
// ---------------------------------------------------
// This module abstracts all database interactions for the
// Zufariy.uz Telegram bot / contact API. It creates a
// `messages` table (if it does not exist) and provides
// simple CRUD‑style functions used by `server/index.js`.
//
// The implementation uses the `sqlite3` package (already
// added to package.json). All functions return Promises
// so they can be awaited in async route handlers.

const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// Database file will be created in the project root.
// Using an absolute path ensures the file persists
// across restarts and works when the app is started
// from any working directory.
const dbPath = path.resolve(__dirname, '..', 'data', 'messages.db');

// Ensure the directory exists
const fs = require('fs');
const dir = path.dirname(dbPath);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

// Open (or create) the SQLite database.
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Failed to open SQLite DB:', err);
  } else {
    console.log('✅ SQLite DB ready at', dbPath);
  }
});

// Initialise the messages table.
const initSql = `
CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  timestamp TEXT NOT NULL,
  replied INTEGER DEFAULT 0,
  replyText TEXT,
  replyTime TEXT
);
`;

db.run(initSql, (err) => {
  if (err) {
    console.error('Failed to create messages table:', err);
  }
});

/**
 * Add a new message to the DB.
 * @param {Object} msg - { name, email, message, timestamp, replied }
 * @returns {Promise<number>} inserted row id
 */
function addMessage(msg) {
  const { name, email, message, timestamp, replied = 0 } = msg;
  const sql = `INSERT INTO messages (name, email, message, timestamp, replied)
               VALUES (?, ?, ?, ?, ?)`;
  return new Promise((resolve, reject) => {
    db.run(sql, [name, email, message, timestamp, replied ? 1 : 0], function (err) {
      if (err) return reject(err);
      resolve(this.lastID);
    });
  });
}

/**
 * Retrieve a single message by its ID.
 * @param {number} id
 * @returns {Promise<Object|null>}
 */
function getMessageById(id) {
  const sql = `SELECT * FROM messages WHERE id = ?`;
  return new Promise((resolve, reject) => {
    db.get(sql, [id], (err, row) => {
      if (err) return reject(err);
      if (!row) return resolve(null);
      // Convert integer flag to boolean for consistency
      row.replied = !!row.replied;
      resolve(row);
    });
  });
}

/**
 * Get the most recent N messages, ordered newest first.
 * @param {number} limit
 * @returns {Promise<Array<Object>>}
 */
function getRecentMessages(limit = 50) {
  const sql = `SELECT * FROM messages ORDER BY id DESC LIMIT ?`;
  return new Promise((resolve, reject) => {
    db.all(sql, [limit], (err, rows) => {
      if (err) return reject(err);
      rows.forEach(r => (r.replied = !!r.replied));
      resolve(rows);
    });
  });
}

/**
 * Mark a message as replied and store reply details.
 * @param {number} id
 * @param {string} replyText
 * @returns {Promise<void>}
 */
function markReplied(id, replyText) {
  const replyTime = new Date().toLocaleString('uz-UZ');
  const sql = `UPDATE messages SET replied = 1, replyText = ?, replyTime = ? WHERE id = ?`;
  return new Promise((resolve, reject) => {
    db.run(sql, [replyText, replyTime, id], function (err) {
      if (err) return reject(err);
      resolve();
    });
  });
}

module.exports = {
  addMessage,
  getMessageById,
  getRecentMessages,
  markReplied,
};
