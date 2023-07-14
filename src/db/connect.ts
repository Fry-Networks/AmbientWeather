import mongoose from 'mongoose';
import 'dotenv/config';
export async function connect() {
    const uri = process.env.MONGO_URI;
    if (!uri) {
        throw new Error('MONGO_URI not set!');
    }
    await mongoose.connect(uri, {
        keepAlive: true,
    });

    mongoose.connection.on('connected', () => {
        console.log('Connected to MongoDB!');
    }
    );
    mongoose.connection.on('error', (err) => {
        console.error(`Mongoose connection error:\n${err.stack}`);
    }
    );
    mongoose.connection.on('disconnected', () => {
        console.log('Disconnected from MongoDB!');
    }
    );

}
