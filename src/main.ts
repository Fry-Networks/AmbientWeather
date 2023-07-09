import 'dotenv/config';
import ambient, { Device } from 'ambient-weather-api';
import fs from 'fs';
import Ftp from './Ftp.js';
import path from 'path';
import { fileURLToPath } from 'url';

const ftpClient = new Ftp();
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);
let editedFiles: string[] = []

const apiKey = process.env.AW_API_KEY!;
const applicationKey = process.env.AW_APPLICATION_KEY!;

const api = new ambient({
    apiKey,
    applicationKey
});

function getName(device: Device) {
    return device.info.name;
}

api.connect()
api.on('connect', () => console.log('Connected to Ambient Weather Realtime API!'))

api.on('subscribed', data => {
    console.log('Subscribed to ' + data.devices.length + ' device(s): ')
    console.log(data.devices.map(getName).join(', '))
    console.log(data.devices)
})
api.on('data', data => {
    console.log(data.date + ' - ' + getName(data.device) + ' current outdoor temperature is: ' + data.tempf + '°F')
    log(data)
})
api.subscribe(apiKey)
const log = (data: ambient.DeviceData & { device: ambient.Device }) => {
    const fileName = data.device.macAddress.replace(/:/g, '-');
    const dir = './data';
    const filePath = path.join(dir, `${fileName}.log`);

    // Check if the directory exists, create it if it doesn't.
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    const existingFile = fs.existsSync(filePath);
    console.log(filePath)
    console.log(existingFile)

    const tempLine = data.tempf ? `${data.tempf.toFixed(2)}°F` : '';
    const humidityLine = data.humidity ? `${data.humidity}%` : '';
    const baromrelinLine = data.baromrelin ? `${data.baromrelin.toFixed(2)}inHg` : '';
    const windspeedmphLine = data.windspeedmph ? `${data.windspeedmph}mph` : '';
    const winddirLine = data.winddir ? `${data.winddir}°` : '';
    const windgustmphLine = data.windgustmph ? `${data.windgustmph}mph` : '';
    const solarradiationLine = data.solarradiation ? `${data.solarradiation}W/m^2` : '';
    const uvLine = data.uv ? `${data.uv}UV` : '';
    const lines = [tempLine, humidityLine, baromrelinLine, windspeedmphLine, winddirLine, windgustmphLine, solarradiationLine, uvLine];
    const logLine = `${new Date().toISOString()} - ${lines.filter((line) => line !== '').join(' - ')}\n`;

    if (existingFile) {
        const file = fs.readFileSync(filePath);
        fs.writeFileSync(filePath, file + logLine);
    } else {
        fs.writeFileSync(filePath, logLine);
    }
    if (!editedFiles.includes(fileName)) {
        editedFiles.push(fileName);
    }
}

setInterval(async () => {
    if (editedFiles.length) {
        try {
            await ftpClient.connect().then(() => {

                console.log('Uploading files...');
                console.log(editedFiles);
                editedFiles.map(async (fileName) => {
                    const filePath = path.join(__dirname, `../data/${fileName}.log`);
                    console.log(filePath);
                    const remotePath = `/home/fryscrypto/weather/${fileName}.log`;
                    console.log(`Uploading ${fileName}.log`);
                    await ftpClient.uploadFile(filePath, remotePath);
                    console.log(`Uploaded ${fileName}.log`);

                });

                editedFiles = [];
            });
        } catch (err) {
            console.error(err);
            await ftpClient.disconnect();
        } finally {
            await ftpClient.disconnect();
        }
    }

}, 10000);