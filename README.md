# 🎂 Birthday Reminder App

A simple automated **Birthday Reminder** application built with **Node.js**, **Express**, **SQLite**, and **Nodemailer**. The application stores birthday information and automatically sends daily email reminders for birthdays occurring on the current date.

---

## 📌 Features

* 🎉 Add and manage birthday records
* 📧 Automatically send birthday reminder emails
* ⏰ Daily scheduled reminders using **node-cron**
* 💾 Lightweight SQLite database using **better-sqlite3**
* 🖥️ Server-side rendering with **EJS**
* 🔒 Environment variable support using **dotenv**

---

## 🛠️ Technologies Used

* Node.js
* Express.js
* SQLite (better-sqlite3)
* Nodemailer
* Node Cron
* EJS
* Dotenv

---

## 📂 Project Structure

```text
birthday-reminder/
│
├── app.js
├── package.json
├── .env
├── views/
├── public/
├── database/
└── README.md
```

---

## 🚀 Installation

Clone the repository:

```bash
git clone https://github.com/yourusername/birthday-reminder.git
```

Navigate to the project directory:

```bash
cd birthday-reminder
```

Install dependencies:

```bash
npm install
```

Start the application:

```bash
npm start
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory and configure your email credentials.

Example:

```env
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
PORT=3000
```

> **Note:** If you're using Gmail, it's recommended to use an App Password instead of your regular account password.

---

## 📅 How It Works

1. Store birthday information in the SQLite database.
2. The application checks every day for birthdays matching the current date.
3. If a birthday is found, an email reminder is automatically sent to the configured email address.
4. The scheduler runs automatically using **node-cron**.

---

## 📦 Available Scripts

Start the application:

```bash
npm start
```

Rebuild SQLite dependency after installation:

```bash
npm rebuild better-sqlite3
```

---

## 📋 Dependencies

* Express
* EJS
* Better SQLite3
* Nodemailer
* Node Cron
* Dotenv

---

## 💡 Future Improvements

* User authentication
* Birthday notification dashboard
* SMS reminders
* WhatsApp notifications
* Recurring reminder customization
* Cloud database support
* Docker deployment

---

## 👩‍💻 Author

**Cynthia**

Backend Engineer | Quality Assurance Engineer | Software Tester

---

## 📄 License

This project is licensed under the ISC License.
