const axios = require("axios");
require("dotenv").config();
const IPSTACK_API_BASE_URL = process.env.IPSTACK_API_BASE_URL;
const IPSTACK_API_KEY = process.env.IPSTACK_API_KEY;
const OPEN_CAGE_API_BASE_URL = process.env.OPEN_CAGE_API_BASE_URL;
const OPEN_CAGE_API_KEY = process.env.OPEN_CAGE_API_KEY;

async function getLocationFromIP() {
  const response = await axios.get(
    `${IPSTACK_API_BASE_URL}/check?access_key=${IPSTACK_API_KEY}`
  );
  const { latitude, longitude } = response.data;
  const { stateCode } = await getNameFromIPLocation(latitude, longitude);
  return {
    latitude,
    longitude,
    stateCode,
  };
}

async function getNameFromIPLocation(latitude, longitude) {
  const response = await axios.get(
    `${OPEN_CAGE_API_BASE_URL}/json?q=${latitude}+${longitude}&key=${OPEN_CAGE_API_KEY}`
  );
  const { town, state_code, city } = response.data.results[0].components;
  return { city: town || city, stateCode: state_code };
}

async function getLocationFromZipCode(zipCode) {
  const response = await axios.get(
    `${OPEN_CAGE_API_BASE_URL}/json?q=${zipCode},usa&key=${OPEN_CAGE_API_KEY}`
  );
  const { lat, lng } = response.data.results[0].geometry;
  const { town, state_code, city } = response.data.results[0].components;
  return {
    latitude: lat,
    longitude: lng,
    place: { city: town || city, stateCode: state_code },
  };
}

module.exports = {
  getLocationFromIP,
  getNameFromIPLocation,
  getLocationFromZipCode,
};
