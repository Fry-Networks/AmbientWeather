import axios from 'axios';
import { HttpsProxyAgent } from 'https-proxy-agent';

// Define your proxy configuration
const proxyConfig = {
  host: "172.64.207.185",
  port: 80
};

// Create an instance of the Axios client with the proxy configuration
const axiosInstance = axios.create({
    //@ts-ignore
    httpsAgent: new HttpsProxyAgent(proxyConfig),
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
    }
});

// Your login data
const data = {
    username: 'yourUsername',
    password: 'yourPassword'
};

// Make the POST request using the configured Axios instance
axiosInstance.post('https://api.weatherxm.com/api/v1/auth/login', data)
  .then((loginResponse) => {
    // Handle the response
    console.log(loginResponse.data);
  })
  .catch((error) => {
    // Handle the error
    console.error('Error:', error);
  });
