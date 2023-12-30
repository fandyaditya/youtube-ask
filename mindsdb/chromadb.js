import { instance } from './index'

const connectionParam = {
    "persist_directory": "chromadb/"
}

export const createChromaDb = async () => {
    const database = await instance.Databases.createDatabase({
        name: 'youtube-ask',
        engine: 'chromadb',
        params: connectionParam
    });
    return database;
}

export const insert = async (data) => {
    const { content, metaData } = data
    const insertQuery = `INSERT INTO youtube_ask_kb (content, meta_data) VALUES ('${content}', '${JSON.stringify(metaData)}')`
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