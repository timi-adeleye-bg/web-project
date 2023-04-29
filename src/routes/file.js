const express = require("express");
const fileRoute = express.Router();
const {
  createCountry,
  createState,
  createlGA,
  createProduct,
  createSeed,
} = require("../controllers/fileController");

//route to import country
fileRoute.post("/uploadcountry", createCountry);

//route to import state
fileRoute.post("/uploadstate", createState);

//route to import Local Government Area
fileRoute.post("/uploadlga", createlGA);

//route to import Product
fileRoute.post("/product", createProduct);

//route to import Seed
fileRoute.post("/seed", createSeed);

module.exports = fileRoute;
