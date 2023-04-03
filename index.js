const { Telegraf } = require('telegraf');
const axios = require('axios');
const moment = require('moment');
const crypto = require('crypto');

if (process.env.NODE_ENV === 'development') {
    require('dotenv').config();
}

const BOT_TOKEN = process.env.BOT_TOKEN;

const bot = new Telegraf(BOT_TOKEN);

async function getCurrentIP() {
    const response = await axios.get('https://checkip.amazonaws.com');
    return response.data;
}

bot.start((ctx) => {
    ctx.reply('Welcome!')
});

bot.help((ctx) => {
    ctx.reply('How can I help you?')
});

bot.command('/ip', async (ctx) => {
    const m = moment();
    console.log(`Receive IP request command: ${m.format('DD-MM-YYYY HH:mm:ss')}`);
    const currentIP = await getCurrentIP();
    ctx.reply(currentIP);
});

bot.launch({
    webhook: {
        // Public domain for webhook; e.g.: example.com
        domain: 'telegram.thanhtunguet.info',

        // Port to listen on; e.g.: 8080
        port: 3000,

        // Optional path to listen for.
        // `bot.secretPathComponent()` will be used by default
        hookPath: bot.secretPathComponent(),

        // Optional secret to be sent back in a header for security.
        // e.g.: `crypto.randomBytes(64).toString("hex")`
        secretToken: crypto.randomBytes(64).toString("hex"),
    },
});
