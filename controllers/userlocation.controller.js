const express = require("express");
const userlocation = express.Router();
const {
  getLocationFromIP,
  getNameFromIPLocation,
  getLocationFromZipCode,
} = require("../helper_functions/locator.hf.js");

userlocation.get('/byIP', async (req, res) => res.json(await getLocationFromIP()));

userlocation.get('/location-name', async (req, res) => {
  const { lat, long } = req.query;
  const { stateCode } = await getNameFromIPLocation(lat, long);
  res.json({ stateCode });
});

userlocation.get('/byZip', async (req, res) => {
  const { zipCode } = req.query;
  res.json(await getLocationFromZipCode(zipCode));
});

module.exports = userlocation;
