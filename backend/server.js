// server.js - main
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose'); // add this line
const startTime = Date.now();         // add this line

const connectDB = require('./db');
const linksRouter = require('./routes/links');
const Link = require('./models/Link');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

// health
app.get('/healthz', (req, res) => {
  const uptimeSeconds = Math.round(process.uptime());

  // Map mongoose readyState to a human-readable string
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };

  const dbState = mongoose.connection.readyState;

  res.json({
    ok: true,
    version: '1.0',
    uptimeSeconds,
    startedAt: new Date(startTime).toISOString(),
    now: new Date().toISOString(),
    nodeEnv: process.env.NODE_ENV || 'development',
    db: {
      state: dbState,
      stateText: states[dbState] || 'unknown'
    }
  });
});


// api
app.use('/api/links', linksRouter);

// Redirect route: GET /:code -> 302 redirect or 404
app.get('/:code', async (req, res, next) => {
  try {
    const skipPrefixes = ['api', 'healthz'];
    if (skipPrefixes.includes(req.params.code)) return next();

    const code = req.params.code;

    const link = await Link.findOne({ code });
    if (!link) {
      return res.status(404).send('Not found');
    }

    // increment click count and update last_clicked
    link.clicks += 1;
    link.last_clicked = new Date();
    await link.save();

    return res.redirect(302, link.url);
  } catch (err) {
    console.error('Error in redirect route:', err);
    return res.status(500).send('Internal server error');
  }
});

// catch all
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// start server only after DB connection
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Tinylink backend running on http://localhost:${PORT}`);
  });
});
