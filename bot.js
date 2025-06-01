const TelegramBot = require('node-telegram-bot-api');
const fetch = require('node-fetch'); // or use built-in fetch in Node 18+

// Your bot token from BotFather
const BOT_TOKEN = '7729339808:AAH1wUH6pmH7qUoVZvZnbQj44-uPUC0S2sI';
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// Your WhatsApp Pairing API Endpoint
const PAIRING_API_URL = 'https://sarkar-md-session-generator.koyeb.app/code?number=$'; // <-- replace this

// When user sends /pair
bot.onText(/\/pair/, async (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, '🔄 Generating WhatsApp pairing code...');

  try {
    const res = await fetch(PAIRING_API_URL);
    const data = await res.json();

    const pairingCode = data.pairing_code;

    // Option 1: If pairing code is a base64 QR image
    if (pairingCode.startsWith('data:image')) {
      const base64 = pairingCode.split(',')[1];
      const buffer = Buffer.from(base64, 'base64');
      await bot.sendPhoto(chatId, buffer, {
        caption: '📲 Scan this QR code to link WhatsApp.',
      });
    }
    // Option 2: If it's a plain text session ID
    else {
      await bot.sendMessage(chatId, `📲 Your WhatsApp Pairing Code:\n\`\`\`\n${pairingCode}\n\`\`\``, {
        parse_mode: 'Markdown',
      });
    }
  } catch (err) {
    console.error('Error fetching pairing code:', err.message);
    bot.sendMessage(chatId, '❌ Failed to get pairing code. Try again later.');
  }
});
