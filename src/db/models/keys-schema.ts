import mongoose, { mongo } from 'mongoose';
export const keysSchema = new mongoose.Schema({
	api_key: String,
    address: String,
    timestamp: Date
});
export interface Keys extends mongoose.Document {
	api_key: string;
    address: string;
    timestamp: Date;
}

export const KeysModel = mongoose.model<Keys>('keys', keysSchema);
