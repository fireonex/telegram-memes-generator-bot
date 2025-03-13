import express from 'express';
import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3000;

const token = process.env.TELEGRAM_TOKEN;
if (!token) {
    console.error('TELEGRAM_TOKEN не найден в .env файле');
    process.exit(1);
}

const bot = new TelegramBot(token, {polling: true});

// Тестовые команды
bot.onText(/\/hello/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Hello my friend!');
});

app.get('/', (req, res) => {
    res.send('Сервер работает. Бот подключен.');
});

app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});