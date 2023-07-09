import { fileURLToPath } from 'url';
import Ftp from './Ftp.js';
import path from 'path';
const client = new Ftp();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
client.connect().then(() => {
    client.uploadFile(path.join(__dirname, 'testFtp.js'), '/home/fryscrypto/weather/testFtp.js').then(() => {
        console.log('done');
    }).catch((err) => {
        console.error(err);
    });
});
