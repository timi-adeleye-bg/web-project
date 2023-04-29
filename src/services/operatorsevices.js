const Operator = require("../models/operatorModel");
const Country = require("../models/countryModel");
const State = require("../models/stateModel");
const lGA = require("../models/lgaModel");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const { requiredKeys } = require("./userservices");

//get operator status
const getOperatorStatus = (req) => {
  return new Promise((resolve, reject) => {
    try {
      const jwtToken = req.headers.authorization || req.headers.Authorization;
      const decodedToken = jwt.decode(jwtToken);

      //obtain the operator status from the payload passed into the token
      const operatorStatus = decodedToken.user.foundUser.operator;
      resolve(operatorStatus);
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

const validateState = (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      let { state } = req.body;
      //nationality = nationality.toLowerCase().trim();
      const stateName = state.toLowerCase().trim();
      //console.log(state);

      //check database to fetch country ID
      const countryID = await validateNationality(req);
      const countryId = countryID.toString();
      //console.log(countryId);

      //check state database to fetch country ID
      const foundState = await State.findOne({ stateName });
      //console.log(foundState);
      if (!foundState) {
        reject(new Error("Please enter a valid State"));
      }

      const stateID = foundState._id;
      const stateCountryID = foundState.country_id.toString();
      //console.log(stateCountryID);

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

const validatelGA = (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      let { lga } = req.body;
      //nationality = nationality.toLowerCase().trim();
      const name = lga.toLowerCase().trim();

      //check database to fetch country ID
      const stateID = await validateState(req);
      const stateId = stateID.toString();

      //check state database to fetch country ID
      const foundlGA = await lGA.findOne({ name });
      if (!foundlGA) {
        reject(new Error("Please enter a valid Local Government"));
      }

      const lgaStateID = foundlGA.state_id.toString();

      //validate if state belong to the country
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

module.exports = {
  getOperatorStatus,
  validateNationality,
  validateState,
  validatelGA,
  validateOperatorData,
};
