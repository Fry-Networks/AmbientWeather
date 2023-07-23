import mongoose, { mongo } from 'mongoose';
import 'dotenv/config';
import { EventEmitter } from 'node:events';
export async function connect() {
    const uri = process.env.MONGO_URI;
    if (!uri) {
        throw new Error('MONGO_URI not set!');
    }
    console.log('Connecting to MongoDB...');
    await mongoose.connect(uri);

    mongoose.connection.useDb('main');

    mongoose.connection.on('connected', () => {
        console.log('Connected to MongoDB!');
    });

    mongoose.connection.on('error', (err) => {
        console.error(`Mongoose connection error:\n${err.stack}`);
    });

    mongoose.connection.on('disconnected', () => {
        console.log('Disconnected from MongoDB!');
    });


    mongoose.connection.on('open', async () => {
        const accountCollection = mongoose.connection.collection('weather_accounts');
        const changeStream = accountCollection.watch();
        changeStream.on('change', (change) => {
            if (change.operationType === 'insert') {
                newApiKeyEvent.emit('newApiKey', change.fullDocument._id);
            }
            if (change.operationType === 'delete') {
                newApiKeyEvent.emit('deleteApiKey', change.documentKey._id);
            }
        });
    });
}

export const newApiKeyEvent = new EventEmitter();