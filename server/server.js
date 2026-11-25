// load the settings from .env first, so everything else can use them
require('dotenv').config({ quiet: true });

const express = require('express');
const cors = require('cors');
const pool = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// only allow requests from our React app
app.use(cors({ origin: process.env.CLIENT_URL }));

// read JSON from request bodies (req.body)
app.use(express.json());

// test route: checks the API and the database
app.get('/api/health', async (req, res) => {
  await pool.query('SELECT 1');
  res.json({ status: 'ok', database: 'connected' });
});

// these must come after all routes
app.use(notFound);
app.use(errorHandler);

// connect to the database first, then start the server
async function startServer() {
  try {
    await pool.query('SELECT 1');
    console.log('Connected to MySQL database');

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Could not connect to the database:', error.message);
    process.exit(1); // stop the app if the database is not available
  }
}

startServer();