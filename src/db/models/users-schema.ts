import mongoose, { mongo } from 'mongoose';
export const usersSchema = new mongoose.Schema({
    email: { type: String, default: ""},
    address: {type: String, required: true},
    byod: {
        licenses: { type: [String], default: [] },
        payments: { type: [Date], default: [] }
    }
    
 
});
export interface User extends mongoose.Document {
    email: string,
    address: string,
    byod: {
        licenses: string[],
        payments: Date[]
    }
}


export const UserModel = mongoose.model<User>('users', usersSchema);

export async function getUserByAddress(address: string): Promise<User> {
   let user = await UserModel.findOne({ address: address });
   if(!user) user = await UserModel.create({ address: address });
    return user;
}