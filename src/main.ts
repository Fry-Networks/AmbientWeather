import 'dotenv/config';
import ambient, { Device } from 'ambient-weather-api';
import { startApi } from './api.js';
import { WeatherModel } from './db/models/weather-schema.js';
import { WeatherAccountModel } from 'db/models/weather_accounts.js';
import { newApiKeyEvent } from './db/connect.js';

const clients: Map<string, ambient> = new Map();


const startApp = async () => {
    const applicationKey = process.env.AW_APPLICATION_KEY!;

    startApi();

    // Function to create a new client for a given API key
    const createClientForKey = async (ObjectId: string) => {

        if (clients.has(ObjectId)) return;


        const account = (await WeatherAccountModel.findById(ObjectId))!;
        const client = new ambient({
            apiKey: account.api_key,
            applicationKey
        });

        function getName(device: Device) {
            return device.info.name;
        };

        client.connect();
        client.on('connect', () => {
            console.log(`Connected with key ${account.api_key}`)
            client.subscribe(account.api_key);
        });
        //@ts-ignore
        client.on('error', console.error);
        client.on('subscribed', data => {
            console.log('Subscribed to ' + data.devices.length + ' device(s): ');
            console.log(data.devices.map(getName).join(', '));
            console.log(data.devices);
        });
        client.on('data', data => {
            console.log(data.date + ' - ' + getName(data.device) + ' current outdoor temperature is: ' + data.tempf + '°F');
            log(data);
        });

        clients.set(ObjectId, client);
        return;
    };

    // Create clients for all existing keys
    const apiKeys = await WeatherAccountModel.find({});
    console.log(apiKeys)
    for (const account of apiKeys) {
        try {
            await createClientForKey(account._id);
        } catch (e: any) {
            console.log(`Error creating client for key ${account.api_key} - ${e.stack}`);
        }
    }

    newApiKeyEvent.on('newApiKey', async (ObjectId: string) => {
        await createClientForKey(ObjectId);
    });

    newApiKeyEvent.on('deleteApiKey', async (ObjectId: string) => {
        clients.get(ObjectId)?.disconnect();
        clients.delete(ObjectId);
    });


};

const log = async (data: ambient.DeviceData & { device: ambient.Device }) => {
    const condition = data.tempf || data.humidity || data.humidityin || data.tempinf || data.baromabsin || data.baromrelin
    if (!condition) return;
    const toDb = new WeatherModel({
        timestamp: new Date(data.dateutc),
        temperature: data.tempf,
        winddir: data.winddir,
        windspeedmph: data.windspeedmph,
        windgustmph: data.windgustmph,
        maxdailygust: data.maxdailygust,
        windgustdir: data.windgustdir,
        windspdmph_avg2m: data.windspdmph_avg2m,
        winddir_avg2m: data.winddir_avg2m,
        windspdmph_avg10m: data.windspdmph_avg10m,
        winddir_avg10m: data.winddir_avg10m,
        humidity: data.humidity,
        humidityin: data.humidityin,
        tempf: data.tempf,
        baromrelin: data.baromrelin,
        baromabsin: data.baromabsin,
        uv: data.uv,
        solarradiation: data.solarradiation,
        co2: data.co2,
        hourlyrainin: data.hourlyrainin,
        dailyrainin: data.dailyrainin,
        weeklyrainin: data.weeklyrainin,
        monthlyrainin: data.monthlyrainin,
        yearlyrainin: data.yearlyrainin,
        eventrainin: data.eventrainin,
        totalrainin: data.totalrainin,
        metadata: {
            deviceMAC: data.device.macAddress,
            location: {
                lat: data.device.info.coords.coords.lat,
                lon: data.device.info.coords.coords.lon,
            }
        },
        humidity1: data.humidity1,
        humidity2: data.humidity2,
        humidity3: data.humidity3,
        humidity4: data.humidity4,
        humidity5: data.humidity5,
        humidity6: data.humidity6,
        humidity7: data.humidity7,
        humidity8: data.humidity8,
        humidity9: data.humidity9,
        humidity10: data.humidity10,
        temp1f: data.temp1f,
        temp2f: data.temp2f,
        temp3f: data.temp3f,
        temp4f: data.temp4f,
        temp5f: data.temp5f,
        temp6f: data.temp6f,
        temp7f: data.temp7f,
        temp8f: data.temp8f,
        temp9f: data.temp9f,
        temp10f: data.temp10f,
        soiltemp1f: data.soiltemp1f,
        soiltemp2f: data.soiltemp2f,
        soiltemp3f: data.soiltemp3f,
        soiltemp4f: data.soiltemp4f,
        soiltemp5f: data.soiltemp5f,
        soiltemp6f: data.soiltemp6f,
        soiltemp7f: data.soiltemp7f,
        soiltemp8f: data.soiltemp8f,
        soiltemp9f: data.soiltemp9f,
        soiltemp10f: data.soiltemp10f,
        soilhum1: data.soilhum1,
        soilhum2: data.soilhum2,
        soilhum3: data.soilhum3,
        soilhum4: data.soilhum4,
        soilhum5: data.soilhum5,
        soilhum6: data.soilhum6,
        soilhum7: data.soilhum7,
        soilhum8: data.soilhum8,
        soilhum9: data.soilhum9,
        soilhum10: data.soilhum10,
        batt1: data.batt1,
        batt2: data.batt2,
        batt3: data.batt3,
        batt4: data.batt4,
        batt5: data.batt5,
        batt6: data.batt6,
        batt7: data.batt7,
        batt8: data.batt8,
        batt9: data.batt9,
        batt10: data.batt10,
    });
    await toDb.save();
}


startApp();