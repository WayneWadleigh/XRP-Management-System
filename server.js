require('dotenv').config(); // Load environment variables

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5008; // Ensure it runs on 5008

// Middleware
app.use(express.json());
app.use(cors());

// Ensure the .env file is loaded
console.log("MONGO_URI from .env:", process.env.MONGO_URI); // Debugging line

// MongoDB Connection
const mongoURI = process.env.MONGO_URI; 

if (!mongoURI) {
    console.error("❌ MONGO_URI is missing or undefined. Please check your .env file.");
    process.exit(1); // Stop the server if no MongoDB URI is found
}

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("✅ Database connected successfully!"))
.catch(err => {
    console.error("❌ Database connection failed:", err);
    process.exit(1); // Stop the server if database connection fails
});

// Simple API Route
app.get("/", (req, res) => {
    res.send("🔥 XRP Management System is Running!");
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
