import { assert } from "./assert";
import fetch from "node-fetch";
import TelegramBot from "node-telegram-bot-api";

export const searchPhoto = async (query: string, chatId: number, bot: TelegramBot): Promise<string> => {
    const accessKey = process.env.UNSPLASH_ACCESS_KEY;
    assert(accessKey, 'UNSPLASH_ACCESS_KEY не найден в .env файле');

    const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${query}&client_id=${accessKey}&per_page=40`
    );
    const data = await response.json() as { results: { urls: { regular: string } }[] };

    if (!data.results.length) {
        bot.sendMessage(chatId, 'Фотографии не найдены. Попробуй снова с другим запросом');
        return '';
    }

    const randomIndex = Math.floor(Math.random() * data.results.length);
    return data.results[randomIndex].urls.regular;
};
