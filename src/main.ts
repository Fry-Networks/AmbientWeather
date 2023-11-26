import "dotenv/config";
import ambient, { Device } from "ambient-weather-api";
import { startApi } from "./api/api.js";
import { WeatherModel } from "./db/models/weather-schema.js";
import { newApiKeyEvent } from "./db/connect.js";
import axios from "axios";
import {
  EcoWittDevice,
  EcoWittDeviceData,
  EcoWittDevicesResponse,
} from "types/ecowittTypes.js";
import { Ambientaccount, Ambientmodel, Ecowittaccount, Ecowittmodel, WXMaccount, WXMmodel, WeatherAccount } from "./db/models/weather_accounts.js";

const clients: Map<string, string> = new Map();
const weatherXMClients: Map<string, string> = new Map();
const ambientClients: Map<string, ambient> = new Map();

const startApp = async () => {
  // const applicationKey = process.env.ECOWITT_APPLICATION_KEY!;
  const ambientApplicationKey = process.env.AW_APPLICATION_KEY!;

  startApi();

  const createClientForAmbientKey = async (ObjectId: string) => {
    if (ambientClients.has(ObjectId)) return;

    let account: Ambientaccount = (await Ambientmodel.findById(ObjectId))!;
    if(!account) account = (await WeatherAccount.findById(ObjectId))! as Ambientaccount;
    
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
        account.devices = toDb;
        account.save();
      }
    });
    client.on("data", (data) => {
      console.log(
        data.date +
        " - " +
        getName(data.device) +
        " current outdoor temperature is: " +
        data.tempf +
        "°F"
      );
      logAmbient(data);
    });

    ambientClients.set(ObjectId, client);
    return;
  };

  const createClientForEcoWittKey = async (ObjectId: string) => {
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
  const createClientForWeatherXM = async (ObjectId: string) => {
    if (weatherXMClients.has(ObjectId)) return;

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
    weatherXMClients.set(ObjectId, accountToken);

    return;
  };
  const ambientApiKeys: Ambientaccount[] = await WeatherAccount.find({
    api_type: {
      $in: ["ambient"],
    },
  });
  console.log(ambientApiKeys, "ambient api keys");
  for (let account of ambientApiKeys) {
    try {
      await createClientForAmbientKey(account._id);
    } catch (e: any) {
      console.log(
        `Error creating client for key ${account.api_key} - ${e.stack}`
      );
    }
  }
  const xmTokens: WXMaccount[] = await WXMmodel.find({
    api_type: {
      $in: ["weather-xm"],
    },
  });
  console.log(xmTokens, "weather-xm");
  for (const account of xmTokens) {
    try {
      await createClientForWeatherXM(account._id);
    } catch (e: any) {
      console.log(
        `Error creating client for key ${account.token} - ${e.stack}`
      );
    }
  }

  const ecoapiKeys: Ecowittaccount[] = await Ecowittmodel.find({ api_type: "ecowitt" });
  console.log(ecoapiKeys, "apikeys");
  for (const account of ecoapiKeys) {
    try {
      await createClientForEcoWittKey(account._id);
    } catch (e: any) {
      console.log(
        `Error creating client for key ${account.api_key} - ${e.stack}`
      );
    }
  }

  newApiKeyEvent.on("newApiKey", async (ObjectId: string) => {
    const findedApikey = await WeatherAccount.findById(ObjectId);
    if (findedApikey?.api_type === "ecowitt") {
      await createClientForEcoWittKey(ObjectId);
    } else if (findedApikey?.api_type === "weather-xm") {
      await createClientForWeatherXM(ObjectId);
    } else {
      await createClientForAmbientKey(ObjectId);
    }
  });

  newApiKeyEvent.on("deleteApiKey", async (ObjectId: string) => {
    const findedApikey = await WeatherAccount.findById(ObjectId);
    if (findedApikey?.api_type === "ecowitt") {
      clients.delete(ObjectId);
    } else if (findedApikey?.api_type === "weather-xm") {
      weatherXMClients.delete(ObjectId);
    } else {
      ambientClients.delete(ObjectId);
    }
  });
};

const logEcoWitt = async (data: any, deviceInfo: any) => {

  let fullData: EcoWittDeviceData = data.data;
  let storeD = fullData.data
  console.log(storeD)
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
      deviceMAC: deviceInfo.macAddress,
      location: {
        lat: deviceInfo.infos.coords.lat,
        lon: deviceInfo.infos.coords.lon
      }
    }
  });

  await toDb.save();
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
      deviceMAC: deviceInfo.macAddress,
      location: {
        lat: deviceInfo.infos.coords.lat,
        lon: deviceInfo.infos.coords.lon,
      },
    },
  });
  await toDb.save();
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
      deviceMAC: data.device.macAddress,
      location: {
        lat: data.device.info.coords.coords.lat,
        lon: data.device.info.coords.coords.lon
      }
    }
  });

  await toDb.save();
};


startApp();
