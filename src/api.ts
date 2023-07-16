import express from 'express';
import bodyparser from 'body-parser';
import axios from 'axios';
import { KeysModel } from './db/models/keys-schema.js';
import { connect, newApiKeyEvent } from './db/connect.js';
import { rateLimit } from 'express-rate-limit';
const app = express()
app.use(bodyparser.json());

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 15, // Limit each IP to 15 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

app.use(limiter);
app.set('trust proxy', 1);
app.get('/', function (req, res) {
    res.status(403).send({
        message: 'Please use the API as described in the documentation.'
    });
})

app.post('/api/submitkey', async function (req, res) {
    console.log(req.ip)
    try {
        const data: {
            key: string,
            address: string
        } = req.body;
        console.log(data);
        // Check if the key is already in the database
        const existingKey = await KeysModel.exists({ api_key: data.key });

        if (existingKey) {
            return void res.status(409).send({
                message: 'Key already exists in database.',
                status: 'ERROR'
            });
        }

        // Check regex
        const regexCheck = /^[a-z0-9]{64}$/.test(data.key);
        if (!regexCheck) {
            return void res.status(400).send({
                message: 'Key is invalid. (Didn\'t pass regex check)',
                status: 'ERROR'
            });
        }

        // Check if the key is valid by making a request to the API
        //https://rt.ambientweather.net/v1/devices?applicationKey=&apiKey=
        try {
        await axios.get(`https://rt.ambientweather.net/v1/devices?applicationKey=${process.env.AW_APPLICATION_KEY}&apiKey=${data.key}`);
        } catch (e) {
            return void res.status(400).send({
                message: 'Key is invalid. (Didn\'t pass API check)',
                status: 'ERROR'
            });
        }

        // Add the key to the database
        const key = new KeysModel({
            api_key: data.key,
            address: data.address,
            timestamp: new Date()
        });
        await key.save();

        newApiKeyEvent.emit('newApiKey', key._id);

        res.status(200).send({
            message: 'Successfully linked your API Key to your wallet address!\nWe will soon begin to retreive data from your weather stations/devices.',
            status: 'SUCCESS'
        });
    } catch (e) {
        res.status(500).send({
            message: 'Internal server error.',
            status: 'ERROR'
        });
    };

    });

export async function startApi() {
    await connect();
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Listening on port ${port}`);
    });

}