import TelegramBot = require('node-telegram-bot-api');

export const memeController = (bot: TelegramBot) => {
    return (msg: any) => {
        const chatId = msg.chat.id;

        const options = {
            reply_markup: {
                inline_keyboard: [
                    [{text: "Создать мем", callback_data: "create_meme"}]
                ]
            }
        };

        bot.sendMessage(chatId, "Нажми кнопку ниже, чтобы создать мем🧙", options);
    };
};
