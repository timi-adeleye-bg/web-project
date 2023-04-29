const {
  uploadCountry,
  uploadState,
  uploadlGA,
  uploadProduct,
  uploadSeed,
} = require("../dao/files.dao");

//@desc Import Country file
//@route POST /api/files/uploadcountry
//@access system use

const createCountry = async (req, res) => {
  try {
    let result = await uploadCountry(req);
    res.status(200).json(result);
  } catch (error) {
    // console.log("Error creating user: ", error);
    res.status(404).json(error.message);
  }
};

//@desc Import State file
//@route POST /api/files/uploadstate
//@access system use

const createState = async (req, res) => {
  try {
    let result = await uploadState(req);
    res.status(200).json(result);
  } catch (error) {
    res.status(404).json(error.message);
  }
};

//@desc Import Local Government Area file
//@route POST /api/files/uploadlga
//@access system use

const createlGA = async (req, res) => {
  try {
    let result = await uploadlGA(req);
    res.status(200).json(result);
  } catch (error) {
    res.status(404).json(error.message);
  }
};

//@desc Import Product file
//@route POST /api/files/product
//@access system use

const createProduct = async (req, res) => {
  try {
    let result = await uploadProduct(req);
    res.status(200).json(result);
  } catch (error) {
    res.status(404).json(error.message);
  }
};

//@desc Import Seed file
//@route POST /api/files/seed
//@access system use

const createSeed = async (req, res) => {
  try {
    let result = await uploadSeed(req);
    res.status(200).json(result);
  } catch (error) {
    res.status(404).json(error.message);
  }
};

module.exports = {
  createCountry,
  createState,
  createlGA,
  createProduct,
  createSeed,
};
