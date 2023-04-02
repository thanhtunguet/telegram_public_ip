const express = require('express');
const { Telegraf } = require('telegraf');
const axios = require('axios');

if (process.env.NODE_ENV === 'development') {
    require('dotenv').config();
}

const BOT_TOKEN = process.env.BOT_TOKEN;

const app = express();
const bot = new Telegraf(BOT_TOKEN);

bot.start((ctx) => {
    ctx.reply('Welcome!')
})

bot.help((ctx) => {
    ctx.reply('How can I help you?')
})

bot.command('/ip', async (ctx) => {
    const response = await axios.get('https://checkip.amazonaws.com');
    ctx.reply(response.data);
})

bot.launch()

app.listen(process.env.PORT || 3000, () => {
    bot.telegram.setWebhook(`https://telegram.thanhtunguet.info/bot`);
    console.log('Bot is listening on port 3000');
});
