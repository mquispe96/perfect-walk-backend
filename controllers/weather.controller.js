const axios = require("axios");
const express = require("express");
const weather = express.Router();
const {
  formatAllWeatherData,
} = require("../formatting/weather.format.js");
const { getLocationFromUserInput, getNameFromCoords } = require("../helper_functions/locator.hf.js");

require("dotenv").config();
const WEATHER_BASE_URL = process.env.OPEN_WEATHER_MAP_API_BASE_URL;
const WEATHER_API_KEY = process.env.OPEN_WEATHER_MAP_API_KEY;

weather.get("/byInput", async (req, res) => {
  const { input } = req.query;
  const { lat, long, place } = await getLocationFromUserInput(input);
  const response = await axios.get(
    `${WEATHER_BASE_URL}/onecall?lat=${lat}&lon=${long}&units=imperial&appid=${WEATHER_API_KEY}`
  );
  const formattedData = formatAllWeatherData(response.data);
  res.json({ ...formattedData, place });
});

weather.get("/byCoords", async (req, res) => {
  const { lat, long } = req.query;
  const response = await axios.get(
    `${WEATHER_BASE_URL}/onecall?lat=${lat}&lon=${long}&units=imperial&appid=${WEATHER_API_KEY}`
  );
  const place = await getNameFromCoords(lat, long);
  const formattedData = formatAllWeatherData(response.data);
  res.json({ ...formattedData, place });
});

module.exports = weather;
