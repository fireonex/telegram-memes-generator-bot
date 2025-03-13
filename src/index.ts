import express from 'express';
import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import {assert} from './utils/assert';
import {addTextToImage} from "./utils/imageUtils";
import {searchPhoto} from "./utils/searchPhoto";

dotenv.config();

const app = express();
const port = 3003;

const token = process.env.TELEGRAM_TOKEN;
assert(token, 'TELEGRAM_TOKEN не найден в .env файле');
const bot = new TelegramBot(token, {polling: true});


bot.onText(/\/meme (.+) (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const memeText = match ? match[1] : 'Мем';
    const query = match ? match[2] : 'nature';

    try {
        const photoUrl = await searchPhoto(query);

        const response = await fetch(photoUrl);
        const buffer = await response.arrayBuffer();

        const outputImage = await addTextToImage(Buffer.from(buffer), memeText);

        bot.sendPhoto(chatId, outputImage);
    } catch (error) {
        console.error(error);
        bot.sendMessage(chatId, 'Произошла ошибка при создании мема.');
    }
});

bot.onText(/\/photo (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const query = match ? match[1] : 'nature';
    try {
        const photoUrl = await searchPhoto(query);
        bot.sendPhoto(chatId, photoUrl);
    } catch (error) {
        console.error(error);
        bot.sendMessage(chatId, 'Произошла ошибка при поиске фотографии.');
    }
});


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