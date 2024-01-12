import { getVideoById, generateEmbeddingDocs, insertToVector, getVectorContent, getAnswer} from '../lib/mindsdb/service/index.js'
import * as textHelper from '../helper/text.js'

export const process = async (ctx) => {
    if (!ctx.session.video) {
        return await ctx.reply('Please send me video link via /ask first');
    }

    const contextParam = {
        content: ctx.message.text,
        video: ctx.session.video 
    }
    
    console.log(`Getting vector simmiliarity for: ${ctx.session.video}...`)
    const answerContext = await getVectorContent(contextParam)

    if (answerContext == undefined) {
        console.log(`Failed to get vector simmiliarity for: ${ctx.session.video}`)
        return await ctx.reply('Sorry, something wrong with me, please ask again');
    }

    let context = JSON.stringify(answerContext);
    const sanitizedLastAnswer = textHelper.removeQuoteWord(ctx.session.lastAnswer);
    const sanitizedLastQuestion = textHelper.removeQuoteWord(ctx.session.lastQuestion);
    context += ctx.session.lastAnswer ? ` Last Answer Context: ${sanitizedLastAnswer}` : '';
    context += ctx.session.lastQuestion ? ` Last Question: ${sanitizedLastQuestion}.` : '';

    console.log(`Getting answer for video: ${ctx.session.video}...`)
    const answer = await getAnswer(context, ctx.message.text)

    if (answer == undefined) {
        console.log(`Failed to get answer for: ${ctx.session.video}`)
        return await ctx.reply('Sorry, I dont understand');
    }
    ctx.session.lastAnswer = textHelper.removeQuoteWord(answer);
    ctx.session.lastQuestion = textHelper.removeQuoteWord(ctx.message.text);

    return await ctx.reply(answer)
}

export const initSource = async (ctx) => {
    if (!textHelper.isValidYoutubeLink(ctx.payload)) {
        return await ctx.reply('Invalid youtube link');
    }

    await ctx.reply('Getting video info, please await...');

    console.log(`Getting video: ${ctx.payload} transcript...`)
    const video = await getVideoById(ctx.payload);

    try {
        JSON.parse(video.transcript)
    }catch(err) {
        console.log('Transcript is not available')
        return await ctx.reply(`Sorry, this video can't be asked`);
    }
    
    console.log(`Generating embedding docs...`)
    const subtitleDocument = generateEmbeddingDocs(video.transcript, ctx.payload);
    
    insertToVector(subtitleDocument).then(async () => {
        ctx.session.video = ctx.payload;
        
        //reset last message
        ctx.session.lastAnswer = '';
        ctx.session.lastQuestion='';

        console.log(`Video ${ctx.payload} is inserted to vector`)
        await ctx.reply(`Video ${ctx.payload} is digested, ask me about the video!`);
    });
    return await ctx.reply('Digesting video, please await...')
}