import mongoose, { mongo } from "mongoose";
export const weatherAccountSchema = new mongoose.Schema({
  user_id: mongoose.Schema.Types.ObjectId,
  timestamp: Date,
  api_type: String,
  devices: {
    type: [
      {
        deviceMAC: String,
        infos: {
          coords: {
            lat: Number,
            lon: Number,
          },
          name: String,
        },
      },
    ],
    default: [],
  },
});

export const WeatherAccount = mongoose.model('weather_accounts', weatherAccountSchema);

export interface weatherAccount extends mongoose.Document {
  user_id: mongoose.Schema.Types.ObjectId | string;
  timestamp: Date;
  
  api_type: string;

  devices: {
    deviceMAC: string;
    infos: {
      coords: {
        lat: number;
        lon: number;
      };
      name: string;
    };
  }[];
}
const WXMaccountSchema = new mongoose.Schema({
  token: { type: String, required: true },
  refresh_token: { type: String, required: true },
});
export const WXMmodel = WeatherAccount.discriminator('WXMaccount', WXMaccountSchema);

const AmbientaccountSchema = new mongoose.Schema({
  api_key: { type: String, required: true },
});
export const Ambientmodel = WeatherAccount.discriminator('Ambientaccount', AmbientaccountSchema);

const EcowittaccountSchema = new mongoose.Schema({
  api_key: { type: String, required: true },
  app_key: { type: String, required: true },
});
export const Ecowittmodel = WeatherAccount.discriminator('Ecowittaccount', EcowittaccountSchema);


export interface WXMaccount extends weatherAccount {
  api_type: "wxm";
  token: string;
  refresh_token: string;
}
export interface Ambientaccount extends weatherAccount {
  api_type: "ambient";
  api_key: string;
}
export interface Ecowittaccount extends weatherAccount {
  api_type: "ecowitt";
  api_key: string;
  app_key: string;
}
