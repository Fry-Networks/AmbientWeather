import axios from "axios";

axios.post('https://api.weatherxm.com/api/v1/auth/refresh', {
        refreshToken: "REDACTED_ROTATE_ME",
}).then((res) => {
    console.log(res.data)
});