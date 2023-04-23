const express = require("express");
const fileRoute = express.Router();
const {
  createCountry,
  createState,
  createlGA,
} = require("../controllers/fileController");

//route to import country
fileRoute.post("/uploadcountry", createCountry);

//route to import state
fileRoute.post("/uploadstate", createState);

//route to import Local Government Area
fileRoute.post("/uploadlga", createlGA);

module.exports = fileRoute;
