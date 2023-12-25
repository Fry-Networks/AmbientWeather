// WeatherXM Miner File
import axios from "axios";
import { WXMaccount, WXMmodel } from "../db/models/weather_accounts.js";
import { WeatherModel } from "../db/models/weather-schema.js";
import { Ecowittmodel } from "../db/models/weather_accounts.js";

export const createClientForWeatherXM = async (wxmClients: Map<string, string>, ObjectId: string) => {
    if (wxmClients.has(ObjectId)) return;

    const account: WXMaccount = (await Ecowittmodel.findById(ObjectId))!;

    const accountToken = account.token;

    function getName(device: any) {
        return device.name;
    }

    let devices: any = [];

    try {
        const data: { data: any } = await axios.get('https://api.weatherxm.com/api/v1/me/devices', {
            headers: {
                'accept': 'application/json',
                'Authorization': `Bearer ${accountToken}`,
            },
        });

        const toDb = data?.data?.map((device: any) => {
            return {
                id: device.id,
                deviceMAC: device.label,
                infos: {
                    coords: {
                        lat: device.location.lat,
                        lon: device.location.lon,
                    },
                    name: device.name,
                },
            };
        });

        if (account.devices !== toDb) {
            account.devices = toDb;
            account.save();
            devices = toDb;
        }
    } catch (error) {
        console.error(error);
    }

    const fetchDeviceData = async (val: any) => {
        const today = new Date();

        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');

        const formattedDate = `${year}-${month}-${day}`;
        try {
            const res: any = await axios.get(`https://api.weatherxm.com/api/v1/me/devices/${val.id}/history?fromDate=${formattedDate}&toDate=${formattedDate}`, {
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Bearer ${accountToken}`,
                },
            });
            // axios.get(
            //   `https://api.ecowitt.net/api/v3/device/real_time?application_key=${accountAppKey}&api_key=${accountApiKey}&mac=${val?.deviceMAC}&call_back=all`
            // );
            logXM(res.data, val);
        } catch (error) {
            console.error(error);
        }
    };


    const fetchInterval = async () => {
        if (!Array.isArray(devices) || devices?.length === 0) return;
        await Promise.all(devices?.map((val: any) => fetchDeviceData(val)));
    };

    setInterval(fetchInterval, 300000);
    // devices?.map((val: any) => fetchDeviceData(val))
    wxmClients.set(ObjectId, accountToken);

    return;
};

const logXM = async (data: any, deviceInfo: any) => {
    let storeD = data[0];

    const condition =
        storeD.tz ||
        storeD.date ||
        storeD.hourly
    if (!condition) return;
    const latest = storeD.hourly[storeD.hourly.length - 1]
    const toDb = new WeatherModel({
        timestamp: new Date(latest.timestamp),
        temperature: +latest.temperature,
        winddir: +latest.wind_direction,
        windspeedmph: +latest.wind_speed,
        humidity: +latest.humidity,
        uv: +latest.uv_index,
        solarradiation: +latest.solar_irradiance,
        rainfall: +latest.rainfall.daily.value,
        metadata: {
            type: 'weather-xm',
            deviceMAC: deviceInfo.macAddress || "N/A",
            location: {
                lat: deviceInfo.infos.coords.lat,
                lon: deviceInfo.infos.coords.lon,
            },
        },
    });
    await toDb.save();
};

// Additional WeatherXM-specific functions as needed
