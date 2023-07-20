import mongoose, { mongo } from 'mongoose';
export const devicesSchema = new mongoose.Schema({
	user_id: String,
    miner_key: String, 
    name: String
 
});
export interface Device extends mongoose.Document {
	user_id: string,
    miner_key: string,
    name: string
}

export const DeviceModel = mongoose.model<Device>('devices', devicesSchema);
