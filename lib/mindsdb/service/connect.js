import MindsDB from 'mindsdb-js-sdk';

export let instance = null;

export const getInstance = async () => {

    try {
        if (!instance) {
            await MindsDB.default.connect({
                host: process.env.MINDSDB_HOST
            });
            instance = MindsDB.default;
        }
        return instance;
    } catch(error) {
        console.log(error)
        return
    }
}