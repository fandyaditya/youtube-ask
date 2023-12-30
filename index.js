import "dotenv/config.js";
import express from 'express';
import { Bot } from './telegram/index.js';
import { getInstance } from './mindsdb/service/index.js';


(async () => {
    const mindsdb = await getInstance();
    
    if (!mindsdb) {
        console.log('Failed to connect to mindsdb')
        //sigkill
        process.exit(1)
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
