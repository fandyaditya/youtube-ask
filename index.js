//import mindsdb es6
import { getInstance } from './mindsdb';


(async () => {
    const mindsdb = await getInstance();
    
    if (!mindsdb) {
        console.log('Failed to connect to mindsdb')
        return;
    }

})()