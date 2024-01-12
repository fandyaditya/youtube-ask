import { Telegraf, session } from 'telegraf'
export const Bot = new Telegraf(process.env.BOT_TOKEN)

Bot.use(session({ defaultSession: () => (
    {
        video: '',
        lastAnswer: '',
        lastQuestion: '',
    }) 
}))

Bot.command('help', async (ctx) => {
    return await ctx.reply(
    `
    /ask [video-link] - Ask me about the video\n/session - Show current session
    `)
});

Bot.command('session', async (ctx) => {
    if (!ctx.session.video || ctx.session.video == '') {
        return await ctx.reply('No video to be asked. Please send me video link via /ask first');
    }

    return await ctx.reply(ctx.session.video)
});

Bot.start((ctx) => ctx.reply(`
Welcome!\n\n/ask [video-link] - Ask me about the video\n\n/session - Show current session
`))

Bot.secretPathComponent()