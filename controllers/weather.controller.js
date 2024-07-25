const axios = require("axios");
const express = require("express");
const weather = express.Router();
const {
  formatAllWeatherData,
  formatCurrentWeatherData,
} = require("../formatting/weather.format.js");
const { getNameFromIPLocation } = require("../helper_functions/locator.hf.js");

require("dotenv").config();
const WEATHER_BASE_URL = process.env.OPEN_WEATHER_MAP_API_BASE_URL;
const WEATHER_API_KEY = process.env.OPEN_WEATHER_MAP_API_KEY;

weather.get("/week", async (req, res) => {
  const { lat, long } = req.query;
  const response = await axios.get(
    `${WEATHER_BASE_URL}/onecall?lat=${lat}&lon=${long}&units=imperial&appid=${WEATHER_API_KEY}`
  );
  const formattedData = formatAllWeatherData(response.data);
  const place = await getNameFromIPLocation(lat, long);
  res.json({ ...formattedData, place });
});

weather.get("/current", async (req, res) => {
  const { lat, long } = req.query;
  const response = await axios.get(
    `${WEATHER_BASE_URL}/onecall?lat=${lat}&lon=${long}&exclude=minutely,hourly,daily,alerts&units=imperial&appid=${WEATHER_API_KEY}`
  );
  const formattedData = formatCurrentWeatherData(response.data);
  const place = await getNameFromIPLocation(lat, long);
  res.json({ ...formattedData, place });
});

module.exports = weather;
