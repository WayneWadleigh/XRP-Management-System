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

// Sample Account Schema (for MongoDB)
const accountSchema = new mongoose.Schema({
    name: String,
    balance: Number
});
const Account = mongoose.model("Account", accountSchema);

// Test Route to Fetch Accounts
app.get("/api/accounts", async (req, res) => {
    try {
        const accounts = await Account.find();
        res.json(accounts);
    } catch (error) {
        console.error("Error fetching accounts:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Route for Creating an Account
app.post("/api/accounts", async (req, res) => {
    try {
        const { name, balance } = req.body;
        const newAccount = new Account({ name, balance });
        await newAccount.save();
        res.status(201).json(newAccount);
    } catch (error) {
        console.error("Error creating account:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Root Route
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
