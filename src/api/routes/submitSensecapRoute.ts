import axios from "axios";
import express from "express";
import { newApiKeyEvent } from "../../db/connect.js";
import { SenseCAPAccount, SenseCAPDataHistory } from "../../db/models/sensecap_schema.js";
import { getUserByAddress } from "../../db/models/users-schema.js";

const router = express.Router();

router.post("/api/submitSenseCAPKey", async function (req, res) {
  try {
    const data = req.body;
    console.log(data, "SenseCAP data");

    const existingAccount = await SenseCAPAccount.exists({
      username: data.username,
      password: data.password,
    });

    if (existingAccount) {
      return res.status(409).send({
        message: "Account already exists in the database.",
        status: "ERROR",
      });
    }
    const auth =
      "Basic " +
    new Buffer(`${data.username}` +":"+`${data.password}`
      ).toString("base64");
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "https://sensecap.seeed.cc/1.0/lists/group/devices",
      headers: {
        Authorization: auth,
      },
      data: {
        device_euis: `${data.deviceId}`,
        device_type: "1-gateway",
      },
    };

    const response = await axios.request(config);
    console.log(auth, "auth_____________");
    console.log(response?.data, "API response");

    const apiResponse = response.data;

    if (apiResponse.code !== "0") {
      return res.status(400).send({
        message: "Invalid credentials. (Did not pass API check)",
        status: "ERROR",
      });
    }

    const user = await getUserByAddress(data.address);

    const sensecapAccount = new SenseCAPAccount({
      user_id: user._id,
      timestamp: new Date(),
      api_type: "sensecap",
      walletAddress: data.address,
      username: data.username,
      password: data.password,
      deviceID: data.deviceId,
      groups: apiResponse.data,
    });

    await sensecapAccount.save();
    newApiKeyEvent.emit("newApiKey", sensecapAccount._id);

    res.status(200).send({
      message:
        "Successfully linked your SenseCAP account to your wallet address!",
      status: "SUCCESS",
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({
      message: "Internal server error.",
      status: "ERROR",
    });
  }
});

const fetchDataAndUpdate = async () => {
  try {
    const accounts = await SenseCAPAccount.find();

    for (const account of accounts) {
      const { username, password, _id, deviceID } = account;

      try {
        const auth =
          "Basic " +
          Buffer.from(
            `${username}` +
              ":" +
              `${password}`
          ).toString("base64");
        const config = {
          method: "get",
          maxBodyLength: Infinity,
          url: "https://sensecap.seeed.cc/1.0/lists/group/devices",
          headers: {
            Authorization: auth,
          },
          data: {
            device_euis: `${deviceID}`,
            device_type: "1-gateway",
          },
        };

        const response = await axios.request(config);
        const apiResponse = response.data;

        if (apiResponse.code !== "0") {
          console.error(`Invalid response for account: ${_id}`);
          continue;
        }

        const groups = apiResponse.data;

        // Check if data has changed
        const existingAccount = await SenseCAPAccount.findById(_id);

        if (
          !existingAccount ||
          JSON.stringify(existingAccount.groups) !== JSON.stringify(groups)
        ) {
          await SenseCAPAccount.findByIdAndUpdate(
            _id,
            { groups, timestamp: new Date() },
            { new: true }
          );

          console.log(`Updated data for SenseCAP account: ${_id}`);

          // Save historical data
          const senseCAPDataHistory = new SenseCAPDataHistory({
            sensecapAccountId: _id,
            groups,
            timestamp: new Date(),
          });

          await senseCAPDataHistory.save();
          console.log(`Saved historical data for SenseCAP account: ${_id}`);
        } else {
          console.log(`No changes detected for SenseCAP account: ${_id}`);
        }
      } catch (error) {
        console.error(
          `Error fetching data for SenseCAP account: ${_id}`,
          error
        );
      }
    }
  } catch (error) {
    console.error("Error fetching or updating SenseCAP data:", error);
  }
};

fetchDataAndUpdate();
setInterval(fetchDataAndUpdate, 10 * 60 * 1000);

export default router;
