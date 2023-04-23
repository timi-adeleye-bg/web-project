//import required fields
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const {
  checkDuplicateEmail,
  requiredKeys,
  validateUserData,
  getUserId,
} = require("../services/userservices");

//load dotenv
dotenv.config();

//Sign up a new user
const userSignUp = (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { name, email, password, operator } = req.body;
      //validate input fields
      await validateUserData(req);

      //check if email already exists
      await checkDuplicateEmail(req);

      //hash password to improve security
      const hashedPassword = bcrypt.hashSync(
        password + process.env.BCRYPT_PASSWORD,
        parseInt(process.env.SALT_ROUNDS)
      );

      //create user profile in Database
      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        operator,
      });

      console.log(`User created ${user}`);

      resolve(user);
    } catch (error) {
      reject(error);
    }
  });
};

//authenticate user login details
const authUserLogin = (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      let { email, password } = req.body;
      const keys = ["email", "password"];
      await requiredKeys(req, keys);

      //trim leading and trailing spaces from email
      email = email.trim();

      //check if user exist and validate password
      const foundUser = await User.findOne({ email });
      if (foundUser) {
        if (
          bcrypt.compareSync(
            password + process.env.BCRYPT_PASSWORD,
            foundUser.password
          )
        ) {
          resolve({
            foundUser: { id: foundUser.id, operator: foundUser.operator },
          });
        } else {
          reject(new Error("Email and/or password do not match"));
        }
      } else {
        reject(new Error("Invalid User"));
      }
    } catch (error) {
      reject(error);
    }
  });
};

//update user details
const userProfileUpdate = (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      let { name, operator } = req.body;
      const keys = ["name", "operator"];

      //validate user input
      await requiredKeys(req, keys);

      //validate operator datatype
      if (typeof operator !== "boolean" && operator !== undefined) {
        reject(new Error("operator must be true || false"));
      }

      //remove trailing and leading spaces from name
      name = name.trim();

      //check for user id and obtain user id
      const user_id = await getUserId(req);

      //find user profile by id and update
      const updatedUser = await User.findByIdAndUpdate(
        user_id,
        { name, operator },
        {
          new: true,
          runValidators: true,
        }
      );

      //check if no user is found
      if (!updatedUser) {
        reject(new Error("No User Found"));
      }

      resolve(updatedUser);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { userSignUp, authUserLogin, userProfileUpdate };
