import express from "express";
import axios from "axios";
import UserAgent from 'user-agents';
import { WXMmodel } from "../../db/models/weather_accounts.js";
import { getUserByAddress } from "../../db/models/users-schema.js";
import { SocksProxyAgent } from 'socks-proxy-agent';
import 'dotenv/config';
import { newApiKeyEvent } from "../../db/connect.js";

const router = express.Router();
const proxy = process.env.PROXY;
        const agent = new SocksProxyAgent(
          'socks://' + proxy
          );
const proxyInstance = axios.create({
  httpsAgent: agent,
});
router.post("/api/submitXMToken", async function (req, res) {
  console.log("Received request to submit XM Token");
    try {
        const data: {
          username: string;
          password:string;
          address: string;
        } = req.body;
        try {
          const headers = {
            'User-Agent': new UserAgent().toString(),
        };
        
          const loginResponse:any =await proxyInstance.post('https://api.weatherxm.com/api/v1/auth/login',{username:data.username, password:data.password}, {
            headers: headers,
          })
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
          console.log(loginResponse.data.token)
          const response = await proxyInstance.get(
            'https://api.weatherxm.com/api/v1/me',
            {
              headers: {
                Authorization: `Bearer ${loginResponse.data.token}`,
                'User-Agent': new UserAgent().toString(),
              },
            }
          );
        } catch (e) {
          console.log(e);
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
        newApiKeyEvent.emit("newApiKey", key._id);
        res.status(200).send({
          message:
            "Successfully linked your Token to your wallet address!\nWe will soon begin to retreive data from your weather stations/devices.",
          status: "SUCCESS",
        });
        } catch (error:any) {
          console.log(error);
          res.status(400).send({
            message: error.response.data.message,
            status: "ERROR",
          });
        }
      } catch (e) {
        console.log(e);
        res.status(500).send({
          message: "Internal server error.",
          status: "ERROR",
        });
      }
});

export default router;
