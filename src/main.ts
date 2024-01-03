// Main File
import "dotenv/config";
import { startApi } from "./api/api.js";
import { newApiKeyEvent } from "./db/connect.js";
import { Ambientaccount, Ecowittaccount, Ecowittmodel, WXMaccount, WXMmodel, WeatherAccount } from "./db/models/weather_accounts.js";
import ambient, { Device } from "ambient-weather-api";
import { createClientForAmbientKey } from "./devices/ambient.js";
import { createClientForEcoWittKey } from "./devices/ecowitt.js";
import { createClientForWeatherXM } from "./devices/wxm.js";
const ecowittClients: Map<string, string> = new Map();
const wxmClients: Map<string, string> = new Map();
const ambientClients: Map<string, ambient> = new Map();
const startApp = async () => {
    await startApi();
  
    // Handling for Ambient devices
    const ambientApiKeys: Ambientaccount[] = await WeatherAccount.find({ api_type: { $in: ["ambient"] } });
    for (let account of ambientApiKeys) {
        try {
            await createClientForAmbientKey(ambientClients, account._id);
        }
        catch (e: any) {
            console.log(`Error creating client for key ${account.api_key} - ${e.stack}`);
        }
    }

    // Handling for WeatherXM devices
    

    // Handling for EcoWitt devices
    const ecoapiKeys: Ecowittaccount[] = await Ecowittmodel.find({ api_type: "ecowitt" });
    for (const account of ecoapiKeys) {
        try {
            await createClientForEcoWittKey(ecowittClients, account._id);
        }
        catch (e: any) {
            console.log(`Error creating client for key ${account.api_key} - ${e.stack}`);
        }
    }
    
    const xmTokens: WXMaccount[] = await WXMmodel.find({ api_type: { $in: ["weather-xm"] } });
     for (const account of xmTokens) {
        try {
            await createClientForWeatherXM(wxmClients, account._id);
        }
        catch (e: any) {
            console.log(`Error creating client for key ${account.token} - ${e.stack}`);
        }
    }

    newApiKeyEvent.on("newApiKey", async (ObjectId: string) => {
        const findedApikey = await WeatherAccount.findById(ObjectId);
        if (findedApikey?.api_type === "ecowitt") {
          await createClientForEcoWittKey(ecowittClients, ObjectId);
        } else if (findedApikey?.api_type === "weather-xm") {
          await createClientForWeatherXM(wxmClients, ObjectId);
        } else {
          await createClientForAmbientKey(ambientClients, ObjectId);
        }
    });

    newApiKeyEvent.on("deleteApiKey", async (ObjectId: string) => {
        const findedApikey = await WeatherAccount.findById(ObjectId);
        if (findedApikey?.api_type === "ecowitt") {
          ecowittClients.delete(ObjectId);
        } else if (findedApikey?.api_type === "weather-xm") {
          wxmClients.delete(ObjectId);
        } else {
          ambientClients.delete(ObjectId);
        }
    });
};

startApp();
