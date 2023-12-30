// mindsdb/connect.js
import MindsDB from 'mindsdb-js-sdk';

export let instance = null;

export const getInstance = async () => {
    try {
        if (!instance) {
            await MindsDB.connect({
                host: 'http://127.0.0.1:47334'
            });
            instance = MindsDB;
        }
        return instance;
    } catch(error) {
       return
    }
}