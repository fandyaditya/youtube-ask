import { instance } from './index.js'
import mysql from 'mysql'

export const insert = async (data) => {
    let insertQuery = `INSERT INTO youtube_ask_kb (content, meta_data) VALUES`
    
    //loop through the data and add to query
    data.forEach((item) => {
        const { content, metaData } = item
        insertQuery += ` ('${mysql.escape(content)}', '${mysql.escape(JSON.stringify(metaData))}'),`
    })
    const queryResult = await instance.SQL.runQuery(insertQuery)

    if (queryResult.error_message) {
        console.log(queryResult.error_message)
        return
    }
    return queryResult
}

export const getByContent = async (content) => {
    const query = `SELECT * FROM youtube_ask_kb WHERE content = '${content}'`
    const queryResult = await instance.SQL.runQuery(query)

    if (queryResult.rows.length < 0) {
        return
    }

    return queryResult.rows[0]
}