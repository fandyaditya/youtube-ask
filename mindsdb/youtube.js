import { instance } from './index'

const connectionParam = {
    youtube_api_token : process.env.YOUTUBE_API_TOKEN,
}

const CHUNK_LIMIT = 5

export const createYoutubeDb = async () => {
    const database = await instance.Databases.createDatabase({
        name: 'youtube',
        engine: 'youtube',
        params: connectionParam
    });
    return database;
}

export const getVideoById = async (id) => {
    query = `SELECT * FROM youtube.videos WHERE id = '${id}'`
    const queryResult = await instance.SQL.runQuery(query)

    if (queryResult.rows.length < 0) {
        return
    }

    return queryResult.rows[0]
}

export const generateSubtitleDocument = async (subtitle) => {
    let concatedSubs = []
    const documentFromSubtitle = subtitle.map((item, i) => {
        if (i % CHUNK_LIMIT == 0) {
            const documents = {
                content: concatedSubs.join(' '),
                metaData: {
                    startTime: item.start,
                    endTime: item.end,
                }
            }

            return documents
        }
        concatedSubs.push(item.text)
    })

    return documentFromSubtitle
}

export const parseLink = (link) => {
    const url = new URL(link)
    const videoId = url.searchParams.get('v')

    return videoId
}
