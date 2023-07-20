import mongoose, { mongo } from 'mongoose';
export const weatherAccountsSchema = new mongoose.Schema({
    user_id: String,
    timestamp: Date,
    api_key: String,
    devices: {
        type: [{
            deviceMAC: String,
            infos: {
                coords: {
                    lat: Number,
                    lon: Number
                },
                name: String,
            }
        }],
        default: []
    }
});

export interface weatherAccount extends mongoose.Document {
    user_id: string,
    timestamp: Date,
    api_key: string,
    devices: {
        deviceMAC: string,
        infos: {
            coords: {
                lat: number,
                lon: number
            },
            name: string,
        }
    }
}

export const WeatherAccountModel = mongoose.model<weatherAccount>('weather_accounts', weatherAccountsSchema);
