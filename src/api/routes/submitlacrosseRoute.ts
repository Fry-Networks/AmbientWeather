import axios from "axios";
import express from "express";

const router = express.Router();

router.post("/api/getTemperature", async function (req, res) {
    try {
        const data = {
            email: req.body.email,
            password: req.body.password,
        };

        // Log in to La Crosse Technology
        const token = await lacrosseLogin(data.email, data.password);
        const locations = await lacrosseGetLocations(token);
        const devices = await lacrosseGetDevices(token, locations);

        // Find the temperature device
        for (const device of devices) {
            if (device.device_name === 'temperature') {
                const weatherData = await lacrosseGetWeatherData(token, device);
                const response = {
                    temperature: weatherData['Temperature'].values[weatherData['Temperature'].values.length - 1].s,
                    unit: weatherData['Temperature'].unit,
                    status: "SUCCESS",
                };
                console.log("Response:", response); // Log the response before returning
                return res.status(200).send(response);
            }
        }

        const notFoundResponse = {
            message: "Temperature device not found.",
            status: "ERROR",
        };
        console.log("Response:", notFoundResponse); // Log the not found response before returning
        return res.status(404).send(notFoundResponse);

    } catch (e: any) {
        const errorResponse = {
            message: "Internal server error.",
            status: "ERROR",
        };
        console.error("Error:", e.message); // Log the error message
        console.error("Error details:", e.response?.data || e.response); // Log the full error response if available
        return res.status(500).send(errorResponse);
    }
});

// Function to log in to La Crosse Technology
async function lacrosseLogin(email: any, password: any) {
    const url = "https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=REDACTED_ROTATE_ME";
    const payload = {
        email: email,
        returnSecureToken: true,
        password: password,
    };
    const response = await axios.post(url, payload);
    console.log(response, '______________Response');
    const token = response.data.idToken;

    if (!token) {
        throw new Error("Login Failed. Check credentials and try again.");
    }
    console.log("Login token received:", token); // Log the received token
    return token;
}

// Function to get locations
async function lacrosseGetLocations(token: any) {
    const url = "https://lax-gateway.appspot.com/_ah/api/lacrosseClient/v1.1/active-user/locations";
    const headers = { Authorization: `Bearer ${token}` };
    const response = await axios.get(url, { headers });
    console.log(response,'______locationResponse')

    if (response.status < 200 || response.status >= 300) {
        throw new Error("Failed to get locations.");
    }
    console.log("Locations retrieved:", response.data.items); // Log the retrieved locations
    return response.data.items;
}

// Function to get devices
async function lacrosseGetDevices(token: any, locations: any) {
    const devices = [];
    for (const location of locations) {
        const url = `https://lax-gateway.appspot.com/_ah/api/lacrosseClient/v1.1/active-user/location/${location.id}/sensorAssociations?prettyPrint=false`;
        const headers = { Authorization: `Bearer ${token}` };
        const response = await axios.get(url, { headers });

        if (response.status < 200 || response.status >= 300) {
            throw new Error("Failed to get devices.");
        }
        const rawDevices = response.data.items || [];
        for (const device of rawDevices) {
            const sensor = device.sensor || {};
            devices.push({
                device_name: device.name.toLowerCase().replace(' ', '_'),
                device_id: device.id,
                sensor_type_name: sensor.type.name,
                sensor_id: sensor.id,
                sensor_field_names: sensor.fields.filter((x: string) => x.toLowerCase() !== "notsupported"),
                location: location,
            });
        }
    }
    console.log("Devices retrieved:", devices); // Log the retrieved devices
    return devices;
}

// Function to get weather data
async function lacrosseGetWeatherData(token: any, device: any) {
    const fieldsStr = device.sensor_field_names.join(',') || null;
    const url = `https://ingv2.lacrossetechnology.com/api/v1.1/active-user/device-association/ref.user-device.${device.device_id}/feed?fields=${fieldsStr}&tz=America/Los_Angeles&aggregates=ai.ticks.1&types=spot`;
    const headers = { Authorization: `Bearer ${token}` };
    const response = await axios.get(url, { headers });

    if (response.status < 200 || response.status >= 300) {
        throw new Error("Failed to get weather data.");
    }

    console.log("Weather data retrieved:", response.data[`ref.user-device.${device.device_id}`]['ai.ticks.1'].fields); // Log the weather data
    return response.data[`ref.user-device.${device.device_id}`]['ai.ticks.1'].fields;
}

export default router;
