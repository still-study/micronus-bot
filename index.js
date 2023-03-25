const TelegramApi = require("node-telegram-bot-api");
const {gameOptions, againOptions} = require("./options")

const token = "6035499751:AAEyvDiogUdd1DxE3UTroAcGfHGrloI3BwY";

const bot = new TelegramApi(token, {polling: true});

const chats = {};

const startGame = (chatId) => {
    bot.sendMessage(chatId, "Сейчас я загадаю число от 0 до 9, а ты должен его угадать.");
    const randomNumber = (Math.floor(Math.random() * 10)).toString();
    chats[chatId] = randomNumber;
    console.log('number: ', randomNumber);

    setTimeout(() => {
        bot.sendSticker(chatId, "https://tlgrm.ru/_/stickers/307/e91/307e9166-47ef-38db-a3f4-40bcc8f88956/3.jpg");
        setTimeout(() => {
            bot.sendMessage(chatId, "Отгадывай!!!", gameOptions);
        }, 1000)
    }, 1000)
}

const start = () => {
    bot.setMyCommands([
        {command: "/start", description: "Приветствие"},
        {command: "/info", description: "Получить информацию о пользователе"},
        {command: "/game", description: "Игра"}
    ]);

    bot.on("message", async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;

        if (text === "/start") {
            await bot.sendSticker(chatId, "https://tlgrm.ru/_/stickers/b0d/85f/b0d85fbf-de1b-4aaf-836c-1cddaa16e002/1.webp");
            return bot.sendMessage(chatId, "Привет! Я Micronus Bot");
        }

        if (text === "/info") {
            return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.username}`);
        }

        if (text === "/game") {
            return startGame(chatId);
        }
        return bot.sendMessage(chatId, "О чем ты? Я тебя не понимаю!!!");
    });

    bot.on("callback_query", async msg => {
        const data = msg.data;
        chatId = msg.message.chat.id;
        if (data === "/again") {
            return startGame(chatId);
        }
        if (data === chats[chatId]) {
            return await bot.sendMessage(chatId, `Поздравляю! Ты отгадал цифру ${data}`, againOptions);
        } else {
            return await bot.sendMessage(chatId, `К сожалению ты не отгадал, я загадал цифру ${chats[chatId]}`, againOptions);
        }
    })
}

start();