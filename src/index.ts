import express from 'express';
import {assert} from "./utils/assert";
import TelegramBot from "node-telegram-bot-api";
import {memeController} from "./bot/controllers/memeController";

import dotenv from 'dotenv';
import {callbackController, messageController} from "./bot/controllers/controllers";

dotenv.config();

const app = express();
const port = 3003;

const token = process.env.TELEGRAM_TOKEN;
assert(token, 'TELEGRAM_TOKEN не найден в .env файле');

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/meme/, (msg) => {
    memeController(bot)(msg);
});

bot.on('callback_query', callbackController(bot));
bot.on('message', messageController(bot));

app.get('/', (req, res) => {
    res.send('Сервер работает. Бот подключен.');
});

app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});
