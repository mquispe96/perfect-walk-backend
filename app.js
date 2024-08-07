const cors = require("cors");
const express = require("express");
const {upload} = require('./db/s3Config.js');
const weatherController = require("./controllers/weather.controller.js");
const locationsController = require("./controllers/locations.controller.js");
const userLocationController = require("./controllers/userlocation.controller.js");
const postsController = require("./controllers/posts.controller.js");
const usersController = require("./controllers/users.controller.js");

const app = express();

app.use(cors({
  origin: ['https://perfect-walk.netlify.app'],
  methods: "GET,POST,PUT,DELETE"
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(upload.array("media", 5));
app.use('/userlocation', userLocationController);
app.use('/weather', weatherController);
app.use('/locations', locationsController);
app.use('/posts', postsController);
app.use('/users', usersController);

app.get("/", (req, res) => res.send("Welcome to Perfect Walk App"));

app.get("*", (req, res) => res.status(404).send("Page not found"));

module.exports = app;
