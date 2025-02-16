require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Load environment variables
const PORT = process.env.PORT || 5008;
const MONGO_URI = process.env.MONGO_URI;

// Check if MongoDB URI is set
if (!MONGO_URI) {
    console.error("❌ ERROR: MONGO_URI is missing from .env file");
    process.exit(1);
}

// MongoDB Connection
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("✅ Database connected successfully!"))
.catch((error) => {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1);
});

// Simple API Route for Testing
app.get("/", (req, res) => {
    res.send("🔥 XRP Management System is Running!");
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

// Handle Errors (Prevents Crashes)
process.on("uncaughtException", (err) => {
    console.error("❌ Uncaught Exception:", err);
    process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
    console.error("❌ Unhandled Rejection at:", promise, "reason:", reason);
});
