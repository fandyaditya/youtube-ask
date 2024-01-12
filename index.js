import "dotenv/config.js";
import express from 'express';
import { Bot } from './lib/telegram/index.js';
import { message } from 'telegraf/filters';
import { getInstance } from './lib/mindsdb/service/index.js';
import * as askHandler from './handler/ask_handler.js'

(async () => {
    const mindsdb = await getInstance();
    
    if (!mindsdb) {
        console.log('Failed to connect to mindsdb')
        process.exit(1)
    }
})()
const App = express();
const port = 3000;

Bot.command('ask', async (ctx) => {
  return await askHandler.initSource(ctx)
});

Bot.on(message('text'), async (ctx) => {
  return await askHandler.process(ctx)
})

// Enable graceful stop
process.once('SIGINT', () => Bot.stop('SIGINT'))
process.once('SIGTERM', () => Bot.stop('SIGTERM'))

App.use(express.json());
App.use(await Bot.createWebhook({domain: process.env.BOT_DOMAIN}))
App.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
Bot.launch()