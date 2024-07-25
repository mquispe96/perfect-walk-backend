const cors = require("cors");
const express = require("express");
const weatherController = require("./controllers/weather.controller.js");
const locationsController = require("./controllers/locations.controller.js");
const userLocationController = require("./controllers/userlocation.controller.js");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/userlocation', userLocationController);
app.use('/weather', weatherController);
app.use('/locations', locationsController);

app.get("/", (req, res) => res.send("Welcome to Perfect Walk App"));

app.get("*", (req, res) => res.status(404).send("Page not found"));

module.exports = app;
