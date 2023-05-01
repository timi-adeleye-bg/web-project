//import usermodel, bcrypt and dotenv configuration
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

//load dotenv
dotenv.config();

//Check for duplicate email address
const checkDuplicateEmail = (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      let { email } = req.body;
      // Trim leading and trailing whitespaces from email
      email = email.trim();

      //check database for email address provided
      const userAvailable = await User.findOne({ email });
      if (userAvailable) {
        reject(new Error("Email address already in use"));
      }

      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
};

//Function to validate keys passed in by client
const requiredKeys = (req, keys) => {
  return new Promise((resolve, reject) => {
    for (const key in req.body) {
      if (!keys.includes(key)) {
        reject(new Error(`${key} not expected. Only ${keys} are valid input`));
      }
    }
    resolve(true);
  });
};

//Validating User Input
const validateUserData = (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { name, email, password, operator } = req.body;

      const emailPattern = /^\S+@\S+\.\S+$/;

      //valid input keys to be passed in by the client
      const keys = ["name", "email", "password", "operator"];
      await requiredKeys(req, keys);

      //check if name or email or password is not passed
      if (!name || !email || !password) {
        reject(new Error("Name, email and password fields are required"));
      } else if (typeof operator !== "boolean" && operator !== undefined) {
        reject(new Error("operator must be true || false"));
      } else if (!emailPattern.test(email.trim())) {
        reject(new Error("Please enter a valid email address"));
      } else {
        resolve(true);
      }
    } catch (error) {
      reject(error);
    }
  });
};

//decode token to get user_id
const getUserId = (req) => {
  return new Promise((resolve, reject) => {
    try {
      const jwtToken = req.headers.authorization || req.headers.Authorization;

      const decodedToken = jwt.decode(jwtToken);

      //obtain the user id from the payload passed into the token
      const user_id = decodedToken.user.foundUser.id.toString();
      resolve(user_id);
    } catch (error) {
      reject(new Error("Unable to get user ID"));
    }
  });
};

module.exports = {
  checkDuplicateEmail,
  requiredKeys,
  validateUserData,
  getUserId,
};
