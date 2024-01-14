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

// Make the POST request using the configured Axios instance
axios.post('https://api.weatherxm.com/api/v1/auth/refresh', {
  refreshToken: "REDACTED_ROTATE_ME"
})
  .then((loginResponse) => {
    // Handle the response
    console.log(loginResponse.data);
  })
  .catch((error) => {
    // Handle the error
    console.error('Error:', error);
  });
