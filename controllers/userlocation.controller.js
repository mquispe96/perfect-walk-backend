const express = require("express");
const userlocation = express.Router();
const {
  getLocationFromIP,
  getNameFromIPLocation,
  getLocationFromUserInput,
} = require("../helper_functions/locator.hf.js");

userlocation.get('/byIP', async (req, res) => res.json(await getLocationFromIP()));

userlocation.get('/get-location-name', async (req, res) => {
  const { lat, long } = req.query;
  const { stateCode } = await getNameFromIPLocation(lat, long);
  res.json({ stateCode });
});

userlocation.get('/byUserInput', async (req, res) => {
  const { input } = req.query;
  res.json(await getLocationFromUserInput(input));
});

module.exports = userlocation;
