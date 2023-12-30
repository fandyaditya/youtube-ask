import { instance } from './index.js'

const CHUNK_LIMIT = 10

export const getVideoById = async (link) => {
    const id = parseLink(link)
    const query = `SELECT * FROM youtubedb.videos WHERE video_id = '${id}'`
    const queryResult = await instance.SQL.runQuery(query)

    if (queryResult.rows.length < 0) {
        return
    }

    return queryResult.rows[0]
}

export const generateEmbeddingDocs = (rawSubtitle, link) => {
    const subtitle = JSON.parse(rawSubtitle)
    
    let concatedSubs = [];
    let firstStartTime = 0;

    const documents = subtitle.map((item, i) => {
        item.start = parseFloat(item.start)
        item.duration = parseFloat(item.duration)

        if ( (i != 0 && i % CHUNK_LIMIT == 1) || i == 0) {
            firstStartTime = item.start
        }

        if ( (i != 0 && i % CHUNK_LIMIT == 0) || i == subtitle.length - 1) {
            const documents = {
                content: concatedSubs.join(' '),
                metaData: {
                    startTime: firstStartTime,
                    endTime: item.start + item.duration,
                    link: link
                }
            }
            //reset
            concatedSubs = []
            firstStartTime = 0

            return documents
        }
        concatedSubs.push(item.text)
    }).filter(item => item != undefined)

    return documents
}

const parseLink = (link) => {
    const url = new URL(link)
    if (!url.searchParams.has('v')) {
        const pathname = url.pathname
        const videoId = pathname.substring(1)
        return videoId
    }
    const videoId = url.searchParams.get('v')
    return videoId
}
