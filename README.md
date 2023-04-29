# BG Web Project

A project developed to address a sector business model

### Project Metadata

Stack = Node.js
Database = MongoDB Atlas
Endpoint Test Environment = Postman
Framework = Express.js

const bodyParser = require("body-parser"); index.js
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: true }));

const checkFileUpload = (req, res, next) => { operator controller
if (!req.file) {
return res.status(400).send({ error: "No image uploaded" });
}
next();
};

operator.dao
// const operatorSignUp = (req) => {
// return new Promise(async (resolve, reject) => {
// try {
// const {
// fullName,
// phoneNumber,
// nationality,
// state,
// lga,
// sex,
// dateOfBirth,
// nin,
// } = req.body;

// //validate operator status
// const user_id = await getUserId(req);
// const userStatus = await User.findById(user_id);
// console.log(userStatus.operator);

// if (!userStatus.operator) {
// reject(
// new Error("You need to be an operator to complete registration")
// );
// } else {
// //validate operator data fields
// await validateOperatorData(req);

// //check if user already exist
// const userId = user_id;
// console.log(userId);
// const foundUser = await Operator.findOne({ userId });
// if (foundUser) {
// reject(new Error("User already exist"));
// }

// //validate nationality
// await validateNationality(req);

// // validate state
// await validateState(req);

// //validate Local Gaovernment Area
// await validatelGA(req);

// // Check if user uploaded a file
// const userPicture = req.file ? req.file.path : "";

// //create operator data in Database
// const operator = await Operator.create({
// fullName,
// phoneNumber,
// nationality,
// state,
// lga,
// sex: sex.toLowerCase(),
// dateOfBirth,
// nin,
// userId: user_id,
// userPicture,
// });

// console.log("Operator created successfully");

// resolve(operator);
// }
// } catch (error) {
// console.log(error);
// reject(error);
// }
// });
// };

operatorservices
// const validateNationality = (req) => {
// return new Promise(async (resolve, reject) => {
// try {
// let { nationality } = req.body;
// nationality = nationality.toLowerCase().trim();

// //check database to see if the country exist
// const foundCountry = await Country.findOne({ nationality });
// if (!foundCountry) {
// reject("Services not available in your nation yet");
// } else {
// const countryID = foundCountry.\_id;
// resolve(countryID);
// }
// } catch (error) {
// console.log(error);
// reject(error);
// }
// });
// };
