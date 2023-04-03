const express = require('express');
const { Telegraf } = require('telegraf');
const axios = require('axios');
const moment = require('moment');

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
    const m = moment();
    console.log(`Receive IP request command: ${m.format('DD-MM-YYYY HH:mm:ss')}`);
    const response = await axios.get('https://checkip.amazonaws.com');
    ctx.reply(response.data);
})

bot.launch()

app.use('/bot', async (req, res) => {
    const response = await axios.get('https://checkip.amazonaws.com');
    bot.context.reply(response.data);
    res.status(200).send({});
});

app.listen(process.env.PORT || 3000, () => {
    const url = `https://telegram.thanhtunguet.info/bot${BOT_TOKEN}`;
    bot.telegram.setWebhook(url);
    console.log('Bot is listening on port 3000');
});
