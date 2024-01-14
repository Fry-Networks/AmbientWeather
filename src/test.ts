import axios from 'axios';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { SocksProxyAgent } from "socks-proxy-agent";
import UserAgent from "user-agents";
import 'dotenv/config';
const proxy = process.env.PROXY;
console.log(proxy)
const agent = new SocksProxyAgent(
    'socks://' + proxy
    );
console.log(agent)

// Create an instance of the Axios client with the proxy configuration
const axiosInstance = axios.create({
    //@ts-ignore
    httpsAgent: agent,
    headers: {
        'User-Agent': new UserAgent().toString(),
    }
});

// Make the POST request using the configured Axios instance
axiosInstance.get('https://api.ipify.org?format=json')
  .then((loginResponse) => {
    // Handle the response
    console.log(loginResponse.data);
  })
  .catch((error) => {
    // Handle the error
    console.error('Error:', error);
  });
