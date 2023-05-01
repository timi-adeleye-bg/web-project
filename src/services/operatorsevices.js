const Operator = require("../models/operatorModel");
const Country = require("../models/countryModel");
const State = require("../models/stateModel");
const lGA = require("../models/lgaModel");
const Product = require("../models/productModel");
const Seed = require("../models/seedModel");
const moment = require("moment");
const { requiredKeys, getUserId } = require("./userservices");

//get operator status
const getOperatorStatus = (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      // get user id
      const userId = await getUserId(req);

      //check if user is an operator
      const isOperator = await Operator.findOne({ userId });
      if (!isOperator) {
        reject("User is not an operator");
      }

      //search database to know operator verified status
      const Verified = await Operator.findOne({ userId });
      if (!Verified.isVerified) {
        reject("You need to be verified to complete operation");
      } else {
        const operatorId = Verified.operatorId;
        resolve(operatorId); //resolve operatorId on the opeartor's table
      }
    } catch (error) {
      reject(error);
    }
  });
};

//validate user nationality
const validateNationality = async (req) => {
  try {
    let { nationality } = req.body;

    //nationality = nationality.toLowerCase().trim();
    if (nationality !== undefined) {
      nationality = nationality.toLowerCase().trim();
    } else {
      nationality = "nigeria";
    }

    //check database to see if the country exist
    const foundCountry = await Country.findOne({ nationality });

    if (!foundCountry) {
      throw new Error("Services not available in your nation yet");
    }

    const countryID = foundCountry._id;
    return countryID;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

//validate user state selected
const validateState = (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      let { state } = req.body;
      const stateName = state.toLowerCase().trim();

      //check database to fetch country ID
      const countryID = await validateNationality(req);
      const countryId = countryID.toString();

      //check state database to fetch country ID
      const foundState = await State.findOne({ stateName });

      if (!foundState) {
        reject(new Error("Please enter a valid State"));
      }

      const stateID = foundState._id;
      const stateCountryID = foundState.country_id.toString();

      //validate if state belong to the country
      if (!(countryId === stateCountryID)) {
        reject(new Error("State selected doesn't exist in your country"));
      }

      resolve(stateID);
    } catch (error) {
      reject(error);
    }
  });
};

//validate user Local Government Area Selected
const validatelGA = (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      let { lga } = req.body;

      const name = lga.toLowerCase().trim();

      //check database to fetch state ID
      const stateID = await validateState(req);
      const stateId = stateID.toString();

      //check lga database to fetch state ID
      const foundlGA = await lGA.findOne({ name });
      if (!foundlGA) {
        reject(new Error("Please enter a valid Local Government"));
      }

      const lgaStateID = foundlGA.state_id.toString();

      //validate if lga belong to the state
      if (!(stateId === lgaStateID)) {
        reject(
          new Error("Local Government selected doesn't exist in your state")
        );
      }

      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
};

//valioate Local Government Area Update when State is not defined
const validatelGAUpdate = (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      let { lga } = req.body;
      const name = lga.toLowerCase().trim();

      //fetch state id from lga table
      const existinglGA = await lGA.findOne({ name });
      if (!existinglGA) {
        reject(new Error("Local Government doesn't exist"));
      }

      //fetch state name from state table
      const stateId = existinglGA.state_id;
      const state = await State.findById(stateId);
      if (!state) {
        reject(new Error("State not found"));
      } else {
        resolve(state.stateName);
      }
    } catch (error) {
      reject(error);
    }
  });
};

//validate operator fields
const validateOperatorData = (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      const {
        fullName,
        phoneNumber,
        nationality,
        state,
        lga,
        sex,
        dateOfBirth,
        nin,
      } = req.body;

      const keys = [
        "fullName",
        "phoneNumber",
        "nationality",
        "state",
        "lga",
        "sex",
        "dateOfBirth",
        "nin",
        "userPicture",
      ];
      await requiredKeys(req, keys);

      //declare regex pattern to validate phone number and nin
      const pattern = /^\d{11}$/;

      //check for rquired fields
      if (
        !fullName ||
        !phoneNumber ||
        !nationality ||
        !state ||
        !lga ||
        !sex ||
        !dateOfBirth ||
        !nin
      ) {
        reject(new Error("All fields are required"));
      } else if (!pattern.test(phoneNumber)) {
        reject(new Error("Phone Number not valid"));
      } else if (!["male", "female", "other"].includes(sex.toLowerCase())) {
        reject(new Error("Sex must either be Male, Female or Other"));
      } else if (!pattern.test(nin)) {
        reject(new Error("Invalid NIN"));
      } else if (!moment(dateOfBirth, "YYYY-MM-DD", true).isValid()) {
        reject(new Error("Enter Date of Birth format in YYYY-MM-DD"));
      } else {
        resolve(true);
      }
    } catch (error) {
      reject(error);
    }
  });
};

//validate product
const validateProduct = (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      let { product_id } = req.params;

      //check product database to see if product exist
      const foundProduct = await Product.findOne({ product_id });
      if (!foundProduct) {
        reject(new Error("Product not Found"));
      } else {
        const productID = foundProduct.product_id;
        resolve(productID);
      }
    } catch (error) {
      reject(error);
    }
  });
};

const validateSeed = (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      let { seedId } = req.params;

      //get product ID
      const productID = await validateProduct(req);

      //check database to fetch product ID related to seed ID
      const foundSeed = await Seed.findOne({ seedId });
      if (!foundSeed) {
        reject(new Error("Seed not found"));
      }

      const seedProductId = foundSeed.product_id;
      if (!(productID === seedProductId)) {
        reject(new Error("Seed doesn't belong to selected Product"));
      } else {
        resolve(true);
      }
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  getOperatorStatus,
  validateNationality,
  validateState,
  validatelGA,
  validateOperatorData,
  validateProduct,
  validateSeed,
  validatelGAUpdate,
};
