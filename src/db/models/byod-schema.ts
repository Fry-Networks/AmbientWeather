import mongoose, { mongo } from 'mongoose';
export const byodSchema = new mongoose.Schema({
	user_id: String,
    licenses: [String],
    current_payment: {
        fry: Boolean,
        stripe: Boolean
    },
    payments: [Date]
});
export interface Byod extends mongoose.Document {
	user_id: string,
    licenses: string[],
    current_payment: {
        fry: boolean,
        stripe: boolean
    },
    payments: Date[]
}

export const ByodModel = mongoose.model<Byod>('byod', byodSchema);
