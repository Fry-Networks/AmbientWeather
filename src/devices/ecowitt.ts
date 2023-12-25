// EcoWitt Miner File
import axios from "axios";
import { Ecowittaccount, Ecowittmodel } from "../db/models/weather_accounts.js";
import { WeatherModel } from "../db/models/weather-schema.js";
import { EcoWittDevice, EcoWittDeviceData, EcoWittDevicesResponse } from "../types/ecowittTypes.js";

export const createClientForEcoWittKey = async (clients: Map<string, string>, ObjectId: string) => {
    if (clients.has(ObjectId)) return;

    const account: Ecowittaccount = (await Ecowittmodel.findById(ObjectId))!;

    const accountApiKey = account.api_key;

    const accountAppKey = account.app_key;
    function getName(device: EcoWittDevice) {
        return device.name;
    }

    let devices: any = [];

    try {
        const data: { data: EcoWittDevicesResponse } = await axios.get(
            `https://api.ecowitt.net/api/v3/device/list?application_key=${accountAppKey}&api_key=${accountApiKey}`
        );
        console.log(
            `Subscribed to ${data?.data?.data?.list?.length} devices`,
            data?.data
        );
        console.log(data.data?.data?.list?.map(getName).join(", "));

        const toDb = data?.data?.data?.list?.map((device) => {
            return {
                deviceMAC: device.mac,
                infos: {
                    coords: {
                        lat: device.latitude,
                        lon: device.longitude,
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

    console.log("Hello world devices", devices);

    const fetchDeviceData = async (val: any) => {
        try {
            const data: EcoWittDeviceData = await axios.get(
                `https://api.ecowitt.net/api/v3/device/real_time?application_key=${accountAppKey}&api_key=${accountApiKey}&mac=${val?.deviceMAC}&call_back=all`
            );
            logEcoWitt(data, val);
        } catch (error) {
            console.error(error);
        }
    };

    console.log(devices, "ecowitt devices");

    const fetchInterval = async () => {
        if (!Array.isArray(devices) || devices?.length === 0) return;
        await Promise.all(devices?.map((val: any) => fetchDeviceData(val)));
    };

    setInterval(fetchInterval, 1000);

    clients.set(ObjectId, accountApiKey);

    return;
};

const logEcoWitt = async (data: any, deviceInfo: any) => {
    let fullData: EcoWittDeviceData = data.data;
    let storeD = fullData.data
    const toDb = new WeatherModel({
        timestamp: new Date(parseInt(fullData.time) * 1000),
        temperature: storeD.outdoor?.temperature?.value ? +storeD.outdoor.temperature.value
            : storeD.indoor?.temperature?.value ? +storeD.indoor.temperature.value : null,
        humidity: storeD.outdoor?.humidity?.value ? +storeD.outdoor.humidity.value
            : storeD.indoor?.humidity?.value ? +storeD.indoor.humidity.value : null,
        windspeedmph: storeD.wind?.wind_speed?.value ? +storeD.wind.wind_speed.value : null,
        winddir: storeD.wind?.wind_direction?.value ? +storeD.wind.wind_direction.value : null,
        rainfall: storeD.rainfall?.daily?.value ? +storeD.rainfall.daily.value : null,
        metadata: {
            data_type: 'ecowitt',
            deviceMAC: deviceInfo.macAddress || "N/A",
            location: {
                lat: deviceInfo.infos.coords.lat,
                lon: deviceInfo.infos.coords.lon
            }
        }
    });

    await toDb.save();
};

// Additional EcoWitt-specific functions as needed
