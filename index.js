//import mindsdb es6
import { getInstance } from './mindsdb';
import express from 'express';
import "dotenv/config.js";
import { Bot } from './telegram/index.js';


(async () => {
    const mindsdb = await getInstance();
    
    if (!mindsdb) {
        console.log('Failed to connect to mindsdb')
        return;
    }
})()
const app = express();
const port = 3000;

app.use(express.json());
app.use(await Bot.createWebhook({domain: process.env.BOT_DOMAIN}))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})