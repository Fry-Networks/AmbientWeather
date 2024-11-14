import axios from "axios";
import express from "express";

const router = express.Router();

router.post("/api/getAcuparseWeather", async function (req, res) {
    try {
        const { location } = req.body;

        const apiKey = process.env.ACUPARSE_API_KEY;
        const url = `https://acuparse.com/api/v1/weather?location=${location}&key=${apiKey}`;

        const response = await axios.get(url);

        // Log the response data
        console.log("Acuparse weather data retrieved:", response.data);

        // Return the weather data
        return res.status(200).send({
            weather: response.data,
            status: "SUCCESS",
        });
    } catch (error: any) {
        console.error("Error fetching Acuparse weather data:", error.message);
        return res.status(500).send({
            message: "Internal server error.",
            status: "ERROR",
        });
    }
});

export default router;
