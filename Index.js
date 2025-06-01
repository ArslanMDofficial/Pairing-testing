const TelegramBot = require('node-telegram-bot-api');
const fetch = require('node-fetch');

const TELEGRAM_TOKEN = '7729339808:AAH1wUH6pmH7qUoVZvZnbQj44-uPUC0S2sI';
const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

// Replace with your actual API URL
const PAIRING_API_URL = 'https://sarkar-md-session-generator.koyeb.app/code?number=$';

// Listen for /pair command
bot.onText(/\/pair/, async (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, 'Generating WhatsApp pairing code...');

  try {
    const response = await fetch(PAIRING_API_URL);
    if (!response.ok) throw new Error('Failed to fetch pairing code');

    const data = await response.json();
    const pairingCode = data.pairing_code;

    // Option 1: Send pairing code as text (if it's a string)
    await bot.sendMessage(chatId, `Your WhatsApp pairing code:\n\`\`\`${pairingCode}\`\`\``, { parse_mode: 'Markdown' });

    // Option 2: If pairingCode is a QR code in base64 image format, send as photo:
    /*
    const base64Data = pairingCode.replace(/^data:image\/png;base64,/, "");
    const buffer = Buffer.from(base64Data, 'base64');
    await bot.sendPhoto(chatId, buffer, { caption: "Scan this QR to link your WhatsApp" });
    */
  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, 'Sorry, failed to get pairing code. Try again later.');
  }
});
