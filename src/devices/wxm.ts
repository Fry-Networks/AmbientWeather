// WeatherXM Miner File
import axios from "axios";
import { WXMaccount, WXMmodel } from "../db/models/weather_accounts.js";
import { WeatherModel } from "../db/models/weather-schema.js";
import { Ecowittmodel } from "../db/models/weather_accounts.js";
import 'dotenv/config';
import { SocksProxyAgent } from "socks-proxy-agent";
import UserAgent from "user-agents";
const proxy = process.env.PROXY;
const agent = new SocksProxyAgent(
    'socks://' + proxy
    );
console.log(agent)

export const createClientForWeatherXM = async (wxmClients: Map<string, string>, ObjectId: string) => {
    console.log('Creating client for WeatherXM');
    if (wxmClients.has(ObjectId)) return;
    const account: WXMaccount = (await WXMmodel.findById(ObjectId))!;

    let accountToken = account.token;

    function getName(device: any) {
        return device.name;
    }

    let devices: any = [];
    let firstTime = true;
    const fetchDevices = async () => {
        try {
            console.log('Fetching devices');
            const data: { data: any } = await axios.get('https://api.weatherxm.com/api/v1/me/devices', {
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Bearer ${accountToken}`,
                    'User-Agent': new UserAgent().toString(),
                },
                httpAgent: agent
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
            console.log(toDb)
            if (account.devices !== toDb) {

                account.devices = toDb;
                account.save();
                devices = toDb;
            }
        } catch (error: any) {
            console.log("Error fetching devices")
            console.log(error.response.data)
            if (error.response.status === 401 && firstTime && account.refresh_token) {
                console.log('Refreshing token');
                await refreshToken(account);
                firstTime = false;

                return void fetchDevices();

            } else {
                 console.error(error.response.data);
            }
        }
    };
    fetchDevices();

    const refreshToken = async (account: WXMaccount) => {
        try {
            const newToken = await axios.post('https://api.weatherxm.com/api/v1/auth/refresh', {
                headers: {
                    'User-Agent': new UserAgent().toString(),
                },
                httpAgent: agent,
                data: {
                    refreshToken: account.refresh_token
                }
            });
            account.token = newToken?.data.token;
            await account.save();
            accountToken = newToken?.data.token;
        } catch (error) {
            console.log('Error refreshing token')
            console.error(error);
        }
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
                    'User-Agent': new UserAgent().toString(),
                },
                httpAgent: agent
            });
            // axios.get(
            //   `https://api.ecowitt.net/api/v3/device/real_time?application_key=${accountAppKey}&api_key=${accountApiKey}&mac=${val?.deviceMAC}&call_back=all`
            // );
            logXM(res.data, val);
        } catch (error: any) {
            if (error?.response.status === 401 && account.refresh_token) {
                await refreshToken(account);
                return void fetchDeviceData(val);
            }
            console.error(error);
        }
    };


    const fetchInterval = async () => {
        if (!Array.isArray(devices) || devices?.length === 0) return;
        await Promise.all(devices?.map((val: any) => fetchDeviceData(val)));
    };
    devices?.map((val: any) => fetchDeviceData(val));
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
            data_type: 'weather-xm',
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
