// Ambient Miner File
import ambient, { Device } from "ambient-weather-api";
import { Ambientaccount, Ambientmodel, WeatherAccount } from "../db/models/weather_accounts.js";
import { WeatherModel } from "../db/models/weather-schema.js";
const ambientApplicationKey = process.env.AW_APPLICATION_KEY!;

export const createClientForAmbientKey = async (ambientClients: Map<string, ambient>, ObjectId: string) => {
    if (ambientClients.has(ObjectId)) return;

    let accountData: Ambientaccount = (await Ambientmodel.findById(ObjectId))!;
    if (!accountData) { accountData = (await WeatherAccount.findById(ObjectId))!; }
    const account: Ambientaccount = accountData.toObject();
    const client = new ambient({
        apiKey: account.api_key,
        applicationKey: ambientApplicationKey,
    });

    function getName(device: Device) {
        return device.info.name;
    }

    client.connect();
    client.on("connect", () => {
        console.log(`Connected with key ${account.api_key}`);
        client.subscribe(account.api_key);
    });
    //@ts-ignore
    client.on("error", console.error);
    client.on("subscribed", (data) => {
        console.log("Subscribed to " + data.devices.length + " device(s): ");
        console.log(data.devices.map(getName).join(", "));

        const toDb = data.devices.filter(device => device.info.coords).map((device) => {
            return {
                deviceMAC: device.macAddress,
                data_type: "ambient",
                infos: {
                    coords: {
                        lat: device.info.coords.coords.lat,
                        lon: device.info.coords.coords.lon,
                    },
                    name: device.info.name,
                },
            };
        });

        if (account.devices !== toDb) {
            accountData.devices = toDb;
            accountData.save();
        }
    });
    client.on("data", (data) => {
        logAmbient(data);
    });

    ambientClients.set(ObjectId, client);
    return;
};

const logAmbient = async (data: ambient.DeviceData & { device: ambient.Device }) => {
    const toDb = new WeatherModel({
        timestamp: new Date(data.dateutc),
        temperature: data.tempf, // Assuming 'tempf' is the temperature value for the device location
        humidity: data.humidity, // Assuming 'humidity' is the humidity value for the device location
        windspeedmph: data.windspeedmph,
        winddir: data.winddir,
        rainfall: data.dailyrainin,
        metadata: {
            data_type: "ambient",
            deviceMAC: data.device.macAddress || "N/A",
            location: {
                lat: data.device.info?.coords?.coords?.lat,
                lon: data.device.info?.coords?.coords?.lon
            }
        }
    });

    await toDb.save();
};

// Additional Ambient-specific functions as needed
