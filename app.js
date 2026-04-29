const express = require('express');
const Database = require('better-sqlite3');
const nodemailer = require('nodemailer');
const cron = require('node-cron');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));

// Database Setup
const db = new Database('birthdays.db', { verbose: console.log });
console.log('✅ Connected to SQLite database');

// Create table
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    dob TEXT NOT NULL
  )
`);

// Nodemailer Setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Birthday Check Function
function checkBirthdays() {
  console.log(`🎂 Birthday check started at ${new Date().toLocaleString()}`);

  const today = new Date();
  const monthDay = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const stmt = db.prepare(`SELECT * FROM users WHERE strftime('%m-%d', dob) = ?`);
  const celebrants = stmt.all(monthDay);

  if (celebrants.length === 0) {
    console.log('ℹ️ No birthdays today.');
    return;
  }

  console.log(`🎉 Found ${celebrants.length} birthday(s) today!`);

  celebrants.forEach(user => {
    transporter.sendMail({
      from: `"Birthday Wishes" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: `Happy Birthday, ${user.username}! 🎉🎂`,
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; background: linear-gradient(135deg, #ff9a9e, #fad0c4); padding: 40px; border-radius: 20px; text-align: center; color: #333;">
          <h1 style="font-size: 48px; margin: 0;">🎉 Happy Birthday! 🎂</h1>
          <h2 style="color: #d63384;">Dear ${user.username},</h2>
          <p style="font-size: 22px; margin: 25px 0;">Wishing you a day filled with joy, laughter, cake, and unforgettable moments!</p>
          <p style="font-size: 18px;">Thank you for being part of our growing family. Here's to an amazing new year ahead! 🥳</p>
          <p style="margin-top: 35px; font-size: 16px;">With lots of love,<br><strong>The Team</strong></p>
        </div>
      `
    }).then(() => {
      console.log(`✅ Email sent to: ${user.username} (${user.email})`);
    }).catch(err => {
      console.error(`❌ Failed to send email to ${user.email}`, err.message);
    });
  });
}

// Cron Job
cron.schedule('0 7 * * *', checkBirthdays);

// Routes
app.get('/', (req, res) => {
  const message = req.query.message || '';
  res.render('index', { message });
});

app.post('/add', (req, res) => {
  const { username, email, dob } = req.body;

  if (!username || !email || !dob) {
    return res.redirect('/?message=missing');
  }

  try {
    const stmt = db.prepare('INSERT INTO users (username, email, dob) VALUES (?, ?, ?)');
    stmt.run(username.trim(), email.trim().toLowerCase(), dob);
    console.log(`✅ New user added: ${username} (${email})`);
    res.redirect('/?message=success');
  } catch (err) {
    console.error('Insert error:', err);
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      res.redirect('/?message=duplicate');
    } else {
      res.redirect('/?message=error');
    }
  }
});

app.get('/trigger', (req, res) => {
  checkBirthdays();
  res.send(`<h2 style="color:green">✅ Manual trigger executed! Check terminal.</h2><a href="/">Go Back</a>`);
});

app.get('/users', (req, res) => {
  const users = db.prepare('SELECT * FROM users ORDER BY username').all();
  res.render('users', { users });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`⏰ Cron job scheduled daily at 7:00 AM`);
});