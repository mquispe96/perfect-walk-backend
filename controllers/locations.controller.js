const axios = require('axios');
const express = require('express');
const locations = express.Router();

require('dotenv').config();
const NPS_API_BASE_URL = process.env.NATIONAL_PARK_SERVICE_API_BASE_URL;
const NPS_API_KEY = process.env.NATIONAL_PARK_SERVICE_API_KEY;

locations.get('/byState', async (req, res) => {
  const {stateCode} = req.query;
  const allLocations = await axios.get(`${NPS_API_BASE_URL}/parks?stateCode=${stateCode}&api_key=${NPS_API_KEY}`);
  if (allLocations.data.total === '0') {
    res.status(404).send({error: 'No locations found'});
  } else {
    res.json(allLocations.data.data);
  }
});

locations.get('/byParkCode', async (req, res) => {
  const {parkCode} = req.query;
  const location = await axios.get(`${NPS_API_BASE_URL}/parks?parkCode=${parkCode}&api_key=${NPS_API_KEY}`);
  if (location.data.total === '0') {
    res.status(404).send({error: 'No location found'});
  } else {
    res.json(location.data.data[0]);
  }
});

module.exports = locations;
