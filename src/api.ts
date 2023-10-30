import express from "express";
import bodyparser from "body-parser";
import axios from "axios";
import { WeatherAccountModel } from "./db/models/weather_accounts.js";
import { connect, newApiKeyEvent } from "./db/connect.js";
import { rateLimit } from "express-rate-limit";
import { getUserByAddress } from "./db/models/users-schema.js";
const app = express();
app.use(bodyparser.json());

// Create a rate limiter that tracks by the 'address' field in the request body
const limiter = rateLimit({
  // Use Redis to store rate limit data
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // limit each address to 100 requests per windowMs
  keyGenerator: function (req) {
    // use 'address' field in body as key
    return req.body.address;
  },
  handler: function (req, res) {
    // response when rate limit exceeded
    console.log("Rate limit exceeded for " + req.body.address);
    res.status(429).send({
      message: "Too many requests, please try again later.",
      status: "ERROR",
    });
  },
});

app.use(limiter);
app.set("trust proxy", 1);
app.get("/", function (req, res) {
  res.status(403).send({
    message: "Please use the API as described in the documentation.",
  });
});

app.post("/api/submitkey", async function (req, res) {
  try {
    const data: {
      key: string;
      address: string;
    } = req.body;
    console.log(data);
    // Check if the key is already in the database
    const existingKey = await WeatherAccountModel.exists({ api_key: data.key });

    if (existingKey) {
      return void res.status(409).send({
        message: "Key already exists in database.",
        status: "ERROR",
      });
    }
    // Check regex
    const regexCheck = /^[a-z0-9]{64}$/.test(data.key);
    if (!regexCheck) {
      return void res.status(400).send({
        message: "Key is invalid. (Didn't pass regex check)",
        status: "ERROR",
      });
    }
    // Check if the key is valid by making a request to the API
    //https://rt.ambientweather.net/v1/devices?applicationKey=&apiKey=
    try {
      await axios.get(
        `https://rt.ambientweather.net/v1/devices?applicationKey=${process.env.AW_APPLICATION_KEY}&apiKey=${data.key}`
      );
    } catch (e) {
      return void res.status(400).send({
        message: "Key is invalid. (Didn't pass API check)",
        status: "ERROR",
      });
    }
    // Add the key to the database
    const user = await getUserByAddress(data.address);

    const key = new WeatherAccountModel({
      api_key: data.key,
      user_id: user._id,
      timestamp: new Date(),
      api_type: "ambient",
    });
    await key.save();
    newApiKeyEvent.emit("newApiKey", key._id);

    res.status(200).send({
      message:
        "Successfully linked your API Key to your wallet address!\nWe will soon begin to retreive data from your weather stations/devices.",
      status: "SUCCESS",
    });
  } catch (e) {
    res.status(500).send({
      message: "Internal server error.",
      status: "ERROR",
    });
  }
});

app.post("/api/submitEcokey", async function (req, res) {
  try {
    const data: {
      key: string;
      address: string;
    } = req.body;
    console.log(data);
    // Check if the key is already in the database
    const existingKey = await WeatherAccountModel.exists({
      api_key: data.key,
    });

    if (existingKey) {
      return void res.status(409).send({
        message: "Key already exists in database.",
        status: "ERROR",
      });
    }
    // Check if the key is valid by making a request to the ecowitt api
    try {
      const d: any = await axios.get(
        `https://api.ecowitt.net/api/v3/device/list?application_key=${process.env.ECOWITT_APPLICATION_KEY}&api_key=${data.key}`
      );
      console.log(d?.data, "didkdk");
    } catch (e) {
      return void res.status(400).send({
        message: "Key is invalid. (Didn't pass API check)",
        status: "ERROR",
      });
    }
    // Add the key to the database
    const user = await getUserByAddress(data.address);

    const key = new WeatherAccountModel({
      api_key: data.key,
      user_id: user._id,
      timestamp: new Date(),
      api_type: "ecowitt",
    });
    await key.save();
    newApiKeyEvent.emit("newApiKey", key._id);

    res.status(200).send({
      message:
        "Successfully linked your API Key to your wallet address!\nWe will soon begin to retreive data from your weather stations/devices.",
      status: "SUCCESS",
    });
  } catch (e) {
    res.status(500).send({
      message: "Internal server error.",
      status: "ERROR",
    });
  }
});

export async function startApi() {
  await connect();
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
}
