import "dotenv/config";
import ambient, { Device } from "ambient-weather-api";
import { startApi } from "./api.js";
import { WeatherModel } from "./db/models/weather-schema.js";
import { WeatherAccountModel } from "./db/models/weather_accounts.js";
import { newApiKeyEvent } from "./db/connect.js";
import axios from "axios";
import {
  EcoWittDevice,
  EcoWittDeviceData,
  EcoWittDevicesResponse,
} from "types/ecowittTypes.js";

// const clients: Map<string, ambient> = new Map();

// const startApp = async () => {
//   const applicationKey = process.env.AW_APPLICATION_KEY!;

//   startApi();

// Function to create a new client for a given API key
// const createClientForKey = async (ObjectId: string) => {

//     if (clients.has(ObjectId)) return;

//     const account = (await WeatherAccountModel.findById(ObjectId))!;
//     const client = new ambient({
//         apiKey: account.api_key,
//         applicationKey
//     });

//     function getName(device: Device) {
//         return device.info.name;
//     };

//     client.connect();
//     client.on('connect', () => {
//         console.log(`Connected with key ${account.api_key}`)
//         client.subscribe(account.api_key);
//     });
//     //@ts-ignore
//     client.on('error', console.error);
//     client.on('subscribed', data => {
//         console.log('Subscribed to ' + data.devices.length + ' device(s): ');
//         console.log(data.devices.map(getName).join(', '));

//           const toDb = data.devices.map((device) => {
//               /*devices: {
//       deviceMAC: string,
//       infos: {
//           coords: {
//               lat: number,
//               lon: number
//           },
//           name: string,
//       }
//   }*/
//               return {
//                   deviceMAC: device.macAddress,
//                   infos: {
//                       coords: {
//                           lat: device.info.coords.coords.lat,
//                           lon: device.info.coords.coords.lon
//                       },
//                       name: device.info.name,
//                   }
//               }
//           });

//         if(account.devices !== toDb) {
//             account.devices = toDb;
//             account.save();
//         }
//     });
//     client.on('data', data => {
//         console.log(data.date + ' - ' + getName(data.device) + ' current outdoor temperature is: ' + data.tempf + '°F');
//         log(data);
//     });

//     clients.set(ObjectId, client);
//     return;
// };

// // Create clients for all existing keys
// const apiKeys = await WeatherAccountModel.find({});
// console.log(apiKeys)
// for (const account of apiKeys) {
//     try {
//         await createClientForKey(account._id);
//     } catch (e: any) {
//         console.log(`Error creating client for key ${account.api_key} - ${e.stack}`);
//     }
// }

// newApiKeyEvent.on('newApiKey', async (ObjectId: string) => {
//     await createClientForKey(ObjectId);
// });

// newApiKeyEvent.on('deleteApiKey', async (ObjectId: string) => {
//     clients.get(ObjectId)?.disconnect();
//     clients.delete(ObjectId);
// });
// };

const clients: Map<string, string> = new Map();
const ambientClients: Map<string, ambient> = new Map();

const startApp = async () => {
  const applicationKey = process.env.ECOWITT_APPLICATION_KEY!;
  const ambientApplicationKey = process.env.AW_APPLICATION_KEY!;

  startApi();

  const createClientForAmbientKey = async (ObjectId: string) => {
    if (ambientClients.has(ObjectId)) return;

    const account = (await WeatherAccountModel.findById(ObjectId))!;
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

      const toDb = data.devices.map((device) => {
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

    const account = (await WeatherAccountModel.findById(ObjectId))!;

    const accountApiKey = account.api_key;

    function getName(device: EcoWittDevice) {
      return device.name;
    }

    let devices: any = [];

    try {
      const data: { data: EcoWittDevicesResponse } = await axios.get(
        `https://api.ecowitt.net/api/v3/device/list?application_key=${applicationKey}&api_key=${accountApiKey}`
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
          `https://api.ecowitt.net/api/v3/device/real_time?application_key=${applicationKey}&api_key=${accountApiKey}&mac=${val?.deviceMAC}&call_back=all`
        );
        console.log(data, "data");
        log(data, val);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchInterval = async () => {
      if (devices?.length === 0) return;
      await Promise.all(devices?.map((val: any) => fetchDeviceData(val)));
    };

    setInterval(fetchInterval, 300000);

    clients.set(ObjectId, accountApiKey);

    return;
  };

  const ambientApiKeys = await WeatherAccountModel.find({
    api_type: {
      $in: ["ambient", undefined],
    },
  });
  console.log(ambientApiKeys, "ambient api keys");
  for (const account of ambientApiKeys) {
    try {
      await createClientForAmbientKey(account._id);
    } catch (e: any) {
      console.log(
        `Error creating client for key ${account.api_key} - ${e.stack}`
      );
    }
  }

  const apiKeys = await WeatherAccountModel.find({ api_type: "ecowitt" });
  console.log(apiKeys, "apikeys");
  for (const account of apiKeys) {
    try {
      await createClientForEcoWittKey(account._id);
    } catch (e: any) {
      console.log(
        `Error creating client for key ${account.api_key} - ${e.stack}`
      );
    }
  }

  newApiKeyEvent.on("newApiKey", async (ObjectId: string) => {
    const findedApikey = await WeatherAccountModel.findById(ObjectId);
    if (findedApikey?.api_type === "ecowitt") {
      await createClientForEcoWittKey(ObjectId);
    } else {
      await createClientForAmbientKey(ObjectId);
    }
  });

  newApiKeyEvent.on("deleteApiKey", async (ObjectId: string) => {
    const findedApikey = await WeatherAccountModel.findById(ObjectId);
    if (findedApikey?.api_type === "ecowitt") {
      clients.delete(ObjectId);
    } else {
      ambientClients.delete(ObjectId);
    }
  });
};

const log = async (data: EcoWittDeviceData, deviceInfo: any) => {
  let storeD = data.data;

  const condition =
    storeD.outdoor.temperature.value ||
    storeD.outdoor.humidity.value ||
    storeD.indoor.temperature.value ||
    storeD.indoor.humidity.value;
  if (!condition) return;
  const toDb = new WeatherModel({
    timestamp: new Date(data.time),
    temperature: +storeD.outdoor.temperature.value,
    winddir: +storeD.wind.wind_direction,
    windspeedmph: +storeD.wind.wind_speed,
    windgustmph: +storeD.wind.wind_gust,
    humidity: +storeD.outdoor.humidity.value,
    humidityin: +storeD.indoor.humidity.value,
    tempf: +storeD.outdoor.temperature.value,
    uv: +storeD.solar_and_uvi.uvi.value,
    solarradiation: +storeD.solar_and_uvi.solar.value,
    co2: +storeD.indoor_co2.co2.value,
    hourlyrainin: +storeD.rainfall.hourly.value,
    dailyrainin: +storeD.rainfall.daily.value,
    weeklyrainin: +storeD.rainfall.weekly.value,
    monthlyrainin: +storeD.rainfall.monthly.value,
    yearlyrainin: +storeD.rainfall.yearly.value,
    eventrainin: +storeD.rainfall.event.value,
    totalrainin: +storeD.rainfall.rain_rate.value,
    metadata: {
      deviceMAC: deviceInfo.macAddress,
      location: {
        lat: deviceInfo.infos.coords.lat,
        lon: deviceInfo.infos.coords.lon,
      },
    },
    humidity1: +storeD.temp_and_humidity_ch1.humidity.value,
    humidity2: +storeD.temp_and_humidity_ch2.humidity.value,
    humidity3: +storeD.temp_and_humidity_ch3.humidity.value,
    humidity4: +storeD.temp_and_humidity_ch4.humidity.value,
    humidity5: +storeD.temp_and_humidity_ch5.humidity.value,
    humidity6: +storeD.temp_and_humidity_ch6.humidity.value,
    humidity7: +storeD.temp_and_humidity_ch7.humidity.value,
    humidity8: +storeD.temp_and_humidity_ch8.humidity.value,
    temp1f: +storeD.temp_ch1.temperature.value,
    temp2f: +storeD.temp_ch2.temperature.value,
    temp3f: +storeD.temp_ch3.temperature.value,
    temp4f: +storeD.temp_ch4.temperature.value,
    temp5f: +storeD.temp_ch5.temperature.value,
    temp6f: +storeD.temp_ch6.temperature.value,
    temp7f: +storeD.temp_ch7.temperature.value,
    temp8f: +storeD.temp_ch8.temperature.value,
  });
  await toDb.save();
};

const logAmbient = async (
  data: ambient.DeviceData & { device: ambient.Device }
) => {
  const condition =
    data.tempf ||
    data.humidity ||
    data.humidityin ||
    data.tempinf ||
    data.baromabsin ||
    data.baromrelin;
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
      },
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
};

startApp();
