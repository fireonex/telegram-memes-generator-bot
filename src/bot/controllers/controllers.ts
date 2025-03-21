import TelegramBot = require('node-telegram-bot-api');
import { searchPhoto } from '../../utils/searchPhoto';
import { addTextToImage } from '../../utils/imageUtils';

const userSessions = new Map<number, { step: string, query?: string, memeText?: string }>();

export const messageController = (bot: TelegramBot) => {
    return async (msg: any) => {
        const chatId = msg.chat.id;

        if (!userSessions.has(chatId)) {
            return;
        }

        const session = userSessions.get(chatId);

        if (session?.step === "awaiting_photo_description") {
            session.query = msg.text || "nature";
            session.step = "awaiting_caption";
            bot.sendMessage(chatId, "Придумай подпись для мема");
        }
        else if (session?.step === "awaiting_caption") {
            session.memeText = msg.text || "meme";
            session.step = "creating_meme";

            try {
                const query = session.query ?? "nature";
                const memeText = session.memeText ?? "meme";

                const photoUrl = await searchPhoto(query, chatId, bot);

                if (!photoUrl) return;

                const response = await fetch(photoUrl);
                const buffer = await response.arrayBuffer();
                const outputImage = await addTextToImage(Buffer.from(buffer), memeText);

                bot.sendPhoto(chatId, outputImage);
            } catch (error) {
                console.error(error);
                bot.sendMessage(chatId, 'Произошла ошибка при создании мема');
            }

            userSessions.delete(chatId);
        }
    };
};

export const callbackController = (bot: TelegramBot) => {
    return (query: any) => {
        const chatId = query.message?.chat.id;
        if (!chatId) return;


        if (query.data === "create_meme") {
            userSessions.set(chatId, { step: "awaiting_photo_description" });
            bot.sendMessage(chatId, "Что должно быть на фото? Лучше пиши на английском)");
        }
    };
};
