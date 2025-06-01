require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const fetch = require('node-fetch');
const express = require('express');

const BOT_TOKEN = process.env.TELEGRAM_TOKEN;
const API_URL = process.env.PAIRING_API_URL;

// Initialize the bot with polling
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// Handle /pair command
bot.onText(/\/pair/, async (msg) => {
  const chatId = msg.chat.id;

  try {
    // Log the API URL being used
    console.log("Fetching pairing code from API URL:", API_URL);
    
    // Fetch the pairing code from the API
    const res = await fetch(API_URL);

    // If the response is not OK (e.g., 404 or 500), throw an error
    if (!res.ok) {
      throw new Error(`Failed to fetch pairing code: ${res.statusText}`);
    }

    // Parse the JSON response from the API
    const data = await res.json();

    // Log the API response to help debug
    console.log("API Response:", data);

    // Ensure the pairing code exists in the response
    const pairingCode = data.pairing_code;

    if (!pairingCode) {
      throw new Error("No pairing_code in the response.");
    }

    // Send the pairing code to the user in Telegram
    await bot.sendMessage(
      chatId,
      `🔗 Your WhatsApp Pairing Code:\n\`\`\`\n${pairingCode}\n\`\`\``,
      { parse_mode: 'Markdown' }
    );

  } catch (err) {
    // Log the error in the console for debugging
    console.error("Error in /pair handler:", err);

    // Notify the user about the error
    bot.sendMessage(chatId, '❌ Error fetching pairing code. Please try again later.');
  }
});

// Express server for keep-alive (for platforms like Render, Replit)
const app = express();
app.get('/', (req, res) => res.send('🤖 Bot is running!'));
app.listen(3000, () => console.log('🌐 Express server started on port 3000'));
