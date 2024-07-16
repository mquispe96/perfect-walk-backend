const axios = require('axios');
const express = require('express');
const weather = express.Router();
const {
  formatAllWeatherData,
  formatCurrentWeatherData,
} = require('../formatting/weather.format.js');
const {
  getLocationFromIP,
  getNameFromIPLocation,
  getLocationFromZipCode,
} = require('../helper_functions/weather.hf.js');

require('dotenv').config();
const WEATHER_BASE_URL = process.env.OPEN_WEATHER_MAP_API_BASE_URL;
const WEATHER_API_KEY = process.env.OPEN_WEATHER_MAP_API_KEY;

weather.get('/', async (req, res) => {
  const {lat, long, zipCode} = req.query;
  if (zipCode) {
    const {latitude, longitude, place} = await getLocationFromZipCode(zipCode);
    const response = await axios.get(
      `${WEATHER_BASE_URL}/onecall?lat=${latitude}&lon=${longitude}&units=imperial&appid=${WEATHER_API_KEY}`,
    );
    const formattedData = formatAllWeatherData(response.data);
    res.json({...formattedData, place});
  } else if (lat && long) {
    const response = await axios.get(
      `${WEATHER_BASE_URL}/onecall?lat=${lat}&lon=${long}&units=imperial&appid=${WEATHER_API_KEY}`,
    );
    const formattedData = formatAllWeatherData(response.data);
    const {place} = await getNameFromIPLocation(lat, long);
    res.json({...formattedData, place});
  } else {
    const {latitude, longitude, place} = await getLocationFromIP();
    const response = await axios.get(
      `${WEATHER_BASE_URL}/onecall?lat=${latitude}&lon=${longitude}&units=imperial&appid=${WEATHER_API_KEY}`,
    );
    const formattedData = formatAllWeatherData(response.data);
    res.json({...formattedData, place});
  }
});

weather.get('/current', async (req, res) => {
  const {lat, long, zipCode} = req.query;
  if (zipCode) {
    const {latitude, longitude, place} = await getLocationFromZipCode(zipCode);
    const response = await axios.get(
      `${WEATHER_BASE_URL}/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,hourly,daily,alerts&units=imperial&appid=${WEATHER_API_KEY}`,
    );
    const formattedData = formatCurrentWeatherData(response.data);
    res.json({...formattedData, place});
  } else if (lat && long) {
    const response = await axios.get(
      `${WEATHER_BASE_URL}/onecall?lat=${lat}&lon=${long}&exclude=minutely,hourly,daily,alerts&units=imperial&appid=${WEATHER_API_KEY}`,
    );
    const formattedData = formatCurrentWeatherData(response.data);
    const {place} = await getNameFromIPLocation(lat, long);
    res.json({...formattedData, place});
  } else {
    const {latitude, longitude, place} = await getLocationFromIP();
    const response = await axios.get(
      `${WEATHER_BASE_URL}/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,hourly,daily,alerts&units=imperial&appid=${WEATHER_API_KEY}`,
    );
    const formattedData = formatCurrentWeatherData(response.data);
    res.json({...formattedData, place});
  }
});

module.exports = weather;
