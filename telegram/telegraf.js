import { Telegraf } from 'telegraf'
import { message } from 'telegraf/filters'
import { getVideoById, generateEmbeddingDocs} from '../mindsdb/service/index.js'
import { insert } from '../mindsdb/service/index.js'

export const Bot = new Telegraf(process.env.BOT_TOKEN)

Bot.command('quit', async (ctx) => {
    // Explicit usage
    await ctx.telegram.leaveChat(ctx.message.chat.id)

    // Using context shortcut
    await ctx.leaveChat()
})

Bot.on(message('text'), async (ctx) => {
    const video = await getVideoById(ctx.message.text)
    const subtitleDocument = generateEmbeddingDocs(video.transcript, ctx.message.text)
    const insertResult = insert(subtitleDocument)
    // console.log(subtitleDocument)
    console.log(insertResult)
    await ctx.reply(`Hello ${ctx.from.first_name}`)
})

Bot.on('callback_query', async (ctx) => {
    // Explicit usage
    await ctx.telegram.answerCbQuery(ctx.callbackQuery.id)

    // Using context shortcut
    await ctx.answerCbQuery()
})

Bot.on('inline_query', async (ctx) => {
    const result = []
    // Explicit usage
    await ctx.telegram.answerInlineQuery(ctx.inlineQuery.id, result)

    // Using context shortcut
    await ctx.answerInlineQuery(result)
})

Bot.on(message('photo'), async (ctx) => {
    // const intent = await findUserIntent(ctx.message.text)
    const photoProps = ctx.message.photo.pop();
    const link = await Bot.telegram.getFileLink(photoProps.file_id);

    const caloriesCalculated = await calculateCaloriesOnImage(link)
    
    await ctx.reply(caloriesCalculated)
})

Bot.launch()

// Enable graceful stop
process.once('SIGINT', () => Bot.stop('SIGINT'))
process.once('SIGTERM', () => Bot.stop('SIGTERM'))

Bot.secretPathComponent()