const axios = require('axios');
const express = require('express');
const weather = express.Router();
const {
  formatAllWeatherData,
  formatCurrentWeatherData,
} = require('../formatting/weather.format.js');

require('dotenv').config();
const WEATHER_BASE_URL = process.env.OPEN_WEATHER_MAP_API_BASE_URL;
const WEATHER_API_KEY = process.env.OPEN_WEATHER_MAP_API_KEY;
const IPSTACK_API_BASE_URL = process.env.IPSTACK_API_BASE_URL;
const IPSTACK_API_KEY = process.env.IPSTACK_API_KEY;

async function getLocationFromIP() {
  const response = await axios.get(
    `${IPSTACK_API_BASE_URL}/check?access_key=${IPSTACK_API_KEY}`,
  );
  const {latitude, longitude} = response.data;
  return {latitude, longitude};
}

weather.get('/', async (req, res) => {
  const {latitude, longitude} = await getLocationFromIP();
  const response = await axios.get(
    `${WEATHER_BASE_URL}/onecall?lat=${latitude}&lon=${longitude}&units=imperial&appid=${WEATHER_API_KEY}`,
  );
  const formattedData = formatAllWeatherData(response.data);
  res.json(formattedData);
});

weather.get('/current', async (req, res) => {
  const {latitude, longitude} = await getLocationFromIP();
  const response = await axios.get(
    `${WEATHER_BASE_URL}/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,hourly,daily,alerts&units=imperial&appid=${WEATHER_API_KEY}`,
  );
  const formattedData = formatCurrentWeatherData(response.data);
  res.json(formattedData);
});

module.exports = weather;
