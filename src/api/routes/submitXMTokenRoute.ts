import express from "express";
import axios from "axios";
import { WXMmodel } from "../../db/models/weather_accounts.js";
import { getUserByAddress } from "../../db/models/users-schema.js";

const router = express.Router();

router.post("/api/submitXMToken", async function (req, res) {
    try {
        const data: {
          username: string;
          password:string;
          address: string;
        } = req.body;
        try {
          const loginResponse:any =await axios.post('https://api.weatherxm.com/api/v1/auth/login',{username:data.username, password:data.password})
        // console.log(loginResponse);
        // Check if the token is already in the database
        const existingToken = await WXMmodel.exists({ refresh_token: loginResponse.data.refreshToken });
    
        if (existingToken) {
          return void res.status(409).send({
            message: "Token already exists in database.",
            status: "ERROR",
          });
        }
        // Check if the key is valid by making a request to the API
        //https://rt.ambientweather.net/v1/devices?applicationKey=&apiKey=
        try {
          const response = await axios.get(
            'https://api.weatherxm.com/api/v1/me',
            {
              headers: {
                Authorization: `Bearer ${loginResponse.data.token}`,
              },
            }
          );
        } catch (e) {
          return void res.status(401).send({
            message: "Token is invalid. (Didn't pass API check)",
            status: "ERROR",
          });
        }
        // Add the key to the database
        const user = await getUserByAddress(data.address);
    
        const key = new WXMmodel({
          api_type:'weather-xm',
          token: loginResponse.data.token,
          refresh_token: loginResponse.data.refreshToken,
          user_id: user._id,
          timestamp: new Date(),
        });
        await key.save();
    
        res.status(200).send({
          message:
            "Successfully linked your Token to your wallet address!\nWe will soon begin to retreive data from your weather stations/devices.",
          status: "SUCCESS",
        });
        } catch (error:any) {
          res.status(400).send({
            message: error.response.data.message,
            status: "ERROR",
          });
        }
      } catch (e) {
        res.status(500).send({
          message: "Internal server error.",
          status: "ERROR",
        });
      }
});

export default router;
