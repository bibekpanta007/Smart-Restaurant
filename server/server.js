// load the settings from .env first, so everything else can use them
require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// only allow requests from our React app
app.use(cors({ origin: process.env.CLIENT_URL }));

// read JSON from request bodies (req.body)
app.use(express.json());

// test route to check the API is running
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Everest Kitchen API is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});