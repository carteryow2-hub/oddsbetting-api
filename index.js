const express = require('express');
const fetch = require('node-fetch');
const app = express();

const API_KEY = process.env.ODDS_API_KEY;
const BASE = 'https://api.the-odds-api.com/v4';

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.get('/odds/:sport', async (req, res) => {
  try {
    const { sport } = req.params;
    const url = `${BASE}/sports/${sport}/odds/?apiKey=${API_KEY}&regions=us&markets=h2h,spreads,totals&oddsFormat=american`;
    const response = await fetch(url);
    const data = await response.json();
    const remaining = response.headers.get('x-requests-remaining');
    if (remaining) res.header('x-requests-remaining', remaining);
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch odds' });
  }
});

app.get('/', (req, res) => res.send('Pickwise API is live!'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Pickwise API running on port ${PORT}`));
