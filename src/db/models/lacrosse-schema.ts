import mongoose from "mongoose";

// Sensor Value Schema
const sensorValueSchema = new mongoose.Schema({
    u: { type: Number, required: true }, // Timestamp or unique identifier
    s: { type: Number, required: true }, // Sensor reading
}, { _id: false });

// Current Lacrosse Data Schema
const LacrosseDataSchema = new mongoose.Schema({
    api_type: { 
        type: String, 
        default: 'lacrosse' 
    },
    walletAddress: { 
        type: String, 
        required: true 
    },
    username: { 
        type: String, 
        required: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    Temperature: {
        values: [sensorValueSchema],
        unit: { type: String, default: "Celsius" },
    },
    Humidity: {
        values: [sensorValueSchema],
        unit_enum: { type: Number },
        unit: { type: String, default: "relative_humidity" },
    },
    HeatIndex: {
        values: [sensorValueSchema],
        unit_enum: { type: Number },
        unit: { type: String, default: "relative_humidity" },
    },
    BarometricPressure: {
        values: [sensorValueSchema],
        unit_enum: { type: Number },
        unit: { type: String, default: "relative_humidity" },
    },
}, { timestamps: true });

// Historical Lacrosse Data Schema
const LacrosseHistorySchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true 
    },
    walletAddress: { 
        type: String, 
        required: true 
    },
    Temperature: {
        values: [sensorValueSchema],
        unit: { type: String, default: "Celsius" },
    },
    Humidity: {
        values: [sensorValueSchema],
        unit_enum: { type: Number },
        unit: { type: String, default: "relative_humidity" },
    },
    HeatIndex: {
        values: [sensorValueSchema],
        unit_enum: { type: Number },
        unit: { type: String, default: "relative_humidity" },
    },
    BarometricPressure: {
        values: [sensorValueSchema],
        unit_enum: { type: Number },
        unit: { type: String, default: "relative_humidity" },
    },
    timestamp: { 
        type: Date, 
        default: Date.now 
    },
}, { timestamps: true });

export const LacrosseData = mongoose.model("Lacrosse", LacrosseDataSchema);
export const LacrosseHistory = mongoose.model("LacrosseHistory", LacrosseHistorySchema);