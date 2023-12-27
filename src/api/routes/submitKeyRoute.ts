import express from "express";
import { Ambientmodel, WeatherAccount } from "../../db/models/weather_accounts.js";
import axios from "axios";
import { getUserByAddress } from "../../db/models/users-schema.js";
import { newApiKeyEvent } from "../../db/connect.js";

const router = express.Router();

router.post("/api/submitkey", async function (req, res) {
    try {
        const data: {
          key: string;
          address: string;
        } = req.body;
        console.log(data);
        // Check if the key is already in the database
        const existingKey = (await WeatherAccount.exists({ api_key: data.key })) || (await Ambientmodel.exists({ token: data.key }));
    
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
    
        const key = new Ambientmodel({
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

export default router;
