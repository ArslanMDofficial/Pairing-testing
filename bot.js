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
    console.log("Fetching pairing code from API URL:", API_URL);

    // Fetch the pairing code from the API
    const res = await fetch(API_URL);

    // Check if the response is OK (200)
    if (!res.ok) {
      throw new Error(`Failed to fetch pairing code: ${res.statusText}`);
    }

    // Parse the response body as JSON
    const data = await res.json();

    console.log("API Response Data:", data);

    // Check if 'pairing_code' exists in the response
    const pairingCode = data.pairing_code;

    if (!pairingCode) {
      throw new Error("No pairing_code found in API response.");
    }

    // Send the pairing code to the user
    await bot.sendMessage(
      chatId,
      `🔗 Your WhatsApp Pairing Code:\n\`\`\`\n${pairingCode}\n\`\`\``,
      { parse_mode: 'Markdown' }
    );

  } catch (err) {
    console.error("Error in /pair handler:", err);

    // Send error message to user
    bot.sendMessage(chatId, '❌ Error fetching pairing code. Please try again later.');
  }
});

// Express server for keeping the bot alive
const app = express();
app.get('/', (req, res) => res.send('🤖 Bot is running!'));
app.listen(3000, () => console.log('🌐 Express server started on port 3000'));
        
