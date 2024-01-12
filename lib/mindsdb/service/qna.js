import { instance } from './index.js'

export const getAnswer = async (context, question) => {
    console.log(context);
    const qnaQuery = `SELECT answer FROM q_n_a_model WHERE context = '${context}' AND question = '${question}'`

    console.log(qnaQuery)

    const queryResult = await instance.SQL.runQuery(qnaQuery)

    if (queryResult.error_message) {
        console.log(queryResult.error_message)
        return
    }
    console.log(queryResult)
    return queryResult.rows[0].answer
}