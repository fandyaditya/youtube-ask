import { instance } from './index.js'
import * as textHelper from '../../../helper/text.js'

export const insert = async (data) => {
    const isVideoAvailable = await isVideoAlreadyInserted(data[0].metaData.link)

    if (isVideoAvailable) {
        console.log('Video already inserted, no need to insert')
        return true
    }

    let insertQuery = `INSERT INTO youtube_ask_kb (content, metadata) VALUES`
    
    //loop through the data and add to query
    data.forEach((item, index) => {
        const { content, metaData } = item
        insertQuery += ` ('${textHelper.removeQuoteWord(content)}', '${JSON.stringify(metaData)}')`
        if (index == data.length - 1) {
            insertQuery += ';'
        } else {
            insertQuery += ','
        }
    })
    const queryResult = await instance.SQL.runQuery(insertQuery)

    if (queryResult.error_message) {
        console.log(queryResult.error_message)
        return
    }
    return queryResult
}

export const getByContent = async (param) => {
    const { content,video } = param
    const query = `SELECT content FROM youtube_ask_kb WHERE content = '${content}' AND youtube_ask_kb.metadata.link = '${video}'`
    const queryResult = await instance.SQL.runQuery(query)

    console.log(query)

    if (queryResult.rows.length <= 0) {
        //Some meta question like "What is the this about", or other will be answered here if first query don't get the similarity"
        //Sadly sometime the query need to do 3-5 times to get result, dunno why
        let retry = 0;
        let allResultRow = []
        while (retry < 5) {
            const allQuery = `SELECT content FROM youtube_ask_kb WHERE youtube_ask_kb.metadata.link = '${video}'`
            const allQueryResult = await instance.SQL.runQuery(allQuery)

            console.log(allQueryResult)

            if (allQueryResult.rows.length <= 0) {
                retry++
            } else {
                allResultRow = allQueryResult.rows
                break;
            }
        }

        return allResultRow;
    }

    return queryResult.rows
}

const isVideoAlreadyInserted = async (videoLink) => {
    const query = `SELECT * FROM youtube_ask_kb WHERE youtube_ask_kb.metadata.link = '${videoLink}' limit 1`
    const queryResult = await instance.SQL.runQuery(query)

    console.log(query)

    if (queryResult.rows.length <= 0) {
        return false
    }

    return true
}