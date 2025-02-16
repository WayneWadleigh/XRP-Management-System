const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Database connected'))
  .catch(err => console.log('Database connection failed:', err));

const AccountSchema = new mongoose.Schema({
  name: String,
  type: String, // e.g., 'Uphold', 'SoFi', 'Xaman'
  apiKey: String,
  apiSecret: String,
  balance: Number,
});

const Account = mongoose.model('Account', AccountSchema);

// Route to add an account
app.post('/add-account', async (req, res) => {
  const { name, type, apiKey, apiSecret } = req.body;
  const newAccount = new Account({ name, type, apiKey, apiSecret, balance: 0 });

  await newAccount.save();
  res.status(201).send('Account added');
});

// Route to fetch all accounts
app.get('/accounts', async (req, res) => {
  const accounts = await Account.find();
  res.json(accounts);
});

// Example API call to fetch balance from Uphold (for illustration purposes)
app.get('/uphold/balance/:accountId', async (req, res) => {
  const { accountId } = req.params;
  const account = await Account.findById(accountId);
  
  // Example of calling Uphold API (replace with actual logic)
  axios.get('https://api.uphold.com/v0/me/balance', {
    headers: { 'Authorization': `Bearer ${account.apiKey}` }
  })
  .then(response => {
    res.json({ balance: response.data.balance });
  })
  .catch(error => {
    res.status(500).send('Error fetching balance');
  });
});

// Example route to initiate a transfer (Buy XRP or send funds)
app.post('/transfer', async (req, res) => {
  const { fromAccountId, toAccountId, amount } = req.body;

  const fromAccount = await Account.findById(fromAccountId);
  const toAccount = await Account.findById(toAccountId);

  // Logic to move funds between accounts goes here

  res.send(`Transferred ${amount} from ${fromAccount.name} to ${toAccount.name}`);
});

// Start server
app.listen(5007, () => {
  console.log('Server running on port 5000');
});
