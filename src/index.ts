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

const userSessions = new Map<number, { step: string, query?: string, memeText?: string }>();

bot.onText(/\/meme/, (msg) => {
    const chatId = msg.chat.id;

    const options = {
        reply_markup: {
            inline_keyboard: [
                [{text: "Создать мем", callback_data: "create_meme"}]
            ]
        }
    };

    bot.sendMessage(chatId, "Нажми кнопку ниже, чтобы создать мем🧙", options);
});

bot.on("callback_query", (query) => {
    const chatId = query.message?.chat.id;
    if (!chatId) return;

    if (query.data === "create_meme") {
        userSessions.set(chatId, {step: "awaiting_photo_description"});
        bot.sendMessage(chatId, "Что должно быть на фото? Лучше пиши на английском)");
    }
});

bot.on("message", async (msg) => {
    const chatId = msg.chat.id;
    if (!userSessions.has(chatId)) return;

    const session = userSessions.get(chatId);

    if (session?.step === "awaiting_photo_description") {
        session.query = msg.text || "nature";
        session.step = "awaiting_caption";
        bot.sendMessage(chatId, "Придумай подпись для мема");
    } else if (session?.step === "awaiting_caption") {
        session.memeText = msg.text || "meme";
        session.step = "creating_meme";

        try {
            const photoUrl = await searchPhoto(session.query ?? "nature");


            const response = await fetch(photoUrl);
            const buffer = await response.arrayBuffer();

            const outputImage = await addTextToImage(Buffer.from(buffer), session.memeText);

            bot.sendPhoto(chatId, outputImage);
        } catch (error) {
            console.error(error);
            bot.sendMessage(chatId, 'Произошла ошибка при создании мема');
        }

        userSessions.delete(chatId);
    }
});

app.get('/', (req, res) => {
    res.send('Сервер работает. Бот подключен.');
});

app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});
