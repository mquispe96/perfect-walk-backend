const express = require("express");
const userlocation = express.Router();
const {
  getLocationFromIP,
  getNameFromCoords,
  getLocationFromUserInput,
} = require("../helper_functions/locator.hf.js");

userlocation.get('/byIP', async (req, res) => res.json(await getLocationFromIP()));

userlocation.get('/locationName', async (req, res) => {
  const { lat, long } = req.query;
  const place = await getNameFromCoords(lat, long);
  res.json(place);
});

userlocation.get('/byUserInput', async (req, res) => {
  const { input } = req.query;
  res.json(await getLocationFromUserInput(input));
});

module.exports = userlocation;
