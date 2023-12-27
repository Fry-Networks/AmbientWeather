import express from "express";
import axios from "axios";
import { Ecowittmodel } from "../../db/models/weather_accounts.js";
import { getUserByAddress } from "../../db/models/users-schema.js";
import { newApiKeyEvent } from "../../db/connect.js";

const router = express.Router();

router.post("/api/submitEcokey", async function (req, res) {
    try {
        const data: {
          key: string;
          app_key: string;
          address: string;
        } = req.body;
        console.log(data);
        // Check if the key is already in the database
        const existingKey = await Ecowittmodel.exists({
          api_key: data.key,
        });
    
        if (existingKey) {
          return void res.status(409).send({
            message: "Api Key already exists in database.",
            status: "ERROR",
          });
        }
    
        const existingAppKey = await Ecowittmodel.exists({
          app_key: data?.app_key,
        });
    
        if (existingAppKey) {
          return void res.status(409).send({
            message: "App Key already exists in database.",
            status: "ERROR",
          });
        }
    
        // Check if the key is valid by making a request to the ecowitt api
        try {
          const d: any = await axios.get(
            `https://api.ecowitt.net/api/v3/device/list?application_key=${data.app_key}&api_key=${data.key}`
          );
          if (d.data.code !== 0) {
            return void res.status(400).send({
              message: "Key is invalid. (Didn't pass API check)",
              status: "ERROR",
            });
          }
        } catch (e) {
          return void res.status(400).send({
            message: "Key is invalid. (Didn't pass API check)",
            status: "ERROR",
          });
        }
        // Add the key to the database
        const user = await getUserByAddress(data.address);
    
        const key = new Ecowittmodel({
          api_key: data.key,
          user_id: user._id,
          timestamp: new Date(),
          api_type: "ecowitt",
          app_key: data.app_key,
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
