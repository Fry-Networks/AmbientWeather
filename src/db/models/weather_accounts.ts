import mongoose, { mongo } from "mongoose";
export const weatherAccountsSchema = new mongoose.Schema({
  user_id: mongoose.Schema.Types.ObjectId,
  timestamp: Date,
  api_key: {
    type:String,
    required:false,
  },
  api_type: {
    type:String,
    required:false,
  },
  app_key: {
    type:String,
    required:false,
  },
  token: {
    type:String,
    required:false,
  },
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

export interface weatherAccount extends mongoose.Document {
  user_id: mongoose.Schema.Types.ObjectId | string;
  timestamp: Date;
  api_key: string;
  api_type: string;
  app_key?: string;
  token: string;
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

export const WeatherAccountModel = mongoose.model<weatherAccount>(
  "weather_accounts",
  weatherAccountsSchema
);
