# Local Prerequisite
We need some preparation before running on local machine
## Telegram Bot

- Create telegram bot, follow this instruction: https://core.telegram.org/bots/tutorial
- Get the bot token

## Ngrok

- We need tunelling from local so we can register our local webhook to telegram bot, for that, we use [ngrok](https://ngrok.com/)
- Follow instruction [here](https://ngrok.com/docs/getting-started/) 
- Save the domain that generated, and run
  ```
  ngrok http --domain=[domain] 3000
  ```

## Mindsdb

- For mindsdb we need 2 credentials. First Youtube Api Key, and Open AI Api Key

### Youtube API Key

- Go to google console, and create api key https://console.cloud.google.com/
- Follow this [tutorial](https://blog.hubspot.com/website/how-to-get-youtube-api-key)

### OpenAI API Key

- Go to OpenAI https://platform.openai.com/
- Register first, and generate the api key

- Cool now, you halfway done!

### Running mindsdb docker
- Build docker images from [mindsdb](https://mindsdb.com/) dockerfile. You need to install [docker](https://docs.docker.com/engine/install/) first before do this.
  ```
  # Build images
  docker build -t my_mindsdb ./lib/mindsdb

  # Run the images
  docker run -p 47334:47334 -p 47335:47335 my_mindsdb
  ```
- Go to browser and access `localhost:47734`, it will take some time after docker container successfully run
- You will see mindsdb Admin UI
- Now, run every sql on `lib/mindsdb/migrations/setup.sql` in sequence there. User your youtube api key and openai api key if required

## Apps Server
- Make sure you install nodejs version 18, and run
```
npm install
```
  And then
```
node index.js
```
- And voila! Your local server is ready!

# On Running Local Server
- This bot only accept 3 commands:
  - `/ask [youtube-video-link]` to set session of video that want to ask
  - `/session` to check what current session
  - `/help` to show available commands
- Now go to telegram and search your bot name
- And your bot is ready to use!

