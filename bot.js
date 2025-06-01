require('dotenv').config();

const TelegramBot = require('node-telegram-bot-api');
const fetch = require('node-fetch');
const express = require('express');

const BOT_TOKEN = process.env.TELEGRAM_TOKEN;
const API_URL = process.env.PAIRING_API_URL;

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

bot.onText(/\/pair/, async (msg) => {
  const chatId = msg.chat.id;

  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    const pairingCode = data.pairing_code;
    await bot.sendMessage(
      chatId,
      `🔗 Your WhatsApp Pairing Code:\n\`\`\`\n${pairingCode}\n\`\`\``,
      { parse_mode: 'Markdown' }
    );
  } catch (err) {
    console.error(err);
    bot.sendMessage(chatId, '❌ Error fetching pairing code.');
  }
});

// Express server for keep-alive
const app = express();
app.get('/', (req, res) => res.send('🤖 Bot is running!'));
app.listen(3000, () => console.log('🌐 Express server started on port 3000'));
