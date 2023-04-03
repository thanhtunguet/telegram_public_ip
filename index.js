const { Telegraf } = require('telegraf');
const axios = require('axios');
const moment = require('moment');
const { createServer } = require('http');
const dgram = require('dgram');

if (process.env.NODE_ENV === 'development') {
    require('dotenv').config();
}

const BOT_TOKEN = process.env.BOT_TOKEN;
const CASH_MAC = process.env.CASH_MAC;
const DOMAIN = process.env.DOMAIN;

const bot = new Telegraf(BOT_TOKEN);

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

const helpText = `Welcome to my \`thanhtunguet_public_ip\`. This bot provides these commands below:

/ip: check current IP

/wol: Wake Cash machine on LAN
`

bot.start((ctx) => {
    ctx.reply(helpText);
});

bot.help(help);

bot.hears('/ip', async (ctx) => {
    const m = moment();
    console.log(`Receive IP request command: ${m.format('DD-MM-YYYY HH:mm:ss')}`);
    const currentIP = await getCurrentIP();
    ctx.reply(`Your current public IP is ${currentIP}`);
});

bot.hears('/wol', async (ctx) => {
    const m = moment();
    console.log(`Receive WoL request command: ${m.format('DD-MM-YYYY HH:mm:ss')}`);
    wakeOnLan(CASH_MAC);
    ctx.reply(`Sent magic packet to ${CASH_MAC}`);
});

start();

// Functions

async function getCurrentIP() {
    const response = await axios.get('https://checkip.amazonaws.com');
    return response.data;
}

async function start() {
    const webhook = await bot.createWebhook({
        domain: DOMAIN,
    });
    createServer(webhook).listen(3000);
}

// Function to convert MAC address string to bytes array
function macToBytes(mac) {
    return mac.split(':').map(x => parseInt(x, 16));
}

// Function to create WoL magic packet
function createMagicPacket(mac) {
    const macBytes = macToBytes(mac);
    const packet = Buffer.alloc(102, 0xFF);
    for (let i = 0; i < 16; i++) {
        for (let j = 0; j < 6; j++) {
            packet[i * 6 + j] = macBytes[j];
        }
    }
    return packet;
}

function wakeOnLan(macAddress) {
    // Send WoL magic packet to broadcast address
    const socket = dgram.createSocket({ type: 'udp4', reuseAddr: true });

    socket.bind(9, () => {
        socket.setBroadcast(true);
        const packet = createMagicPacket(macAddress);
        socket.send(packet, 0, packet.length, 9, '255.255.255.255', (err) => {
            socket.close();
            if (err) {
                console.error(err);
            } else {
                console.log(`WoL magic packet sent successfully to MAC: ${macAddress}`);
            }
        });
    });
}

function help(ctx) {
    ctx.reply(helpText);
}
