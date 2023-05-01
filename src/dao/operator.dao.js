//import required modules
const Operator = require("../models/operatorModel");
const State = require("../models/stateModel");
const lGA = require("../models/lgaModel");
const User = require("../models/userModel");
const Selection = require("../models/selectionModel");
const { getUserId, requiredKeys } = require("../services/userservices");
const {
  validateNationality,
  validateState,
  validatelGA,
  validateOperatorData,
  getOperatorStatus,
  validateProduct,
  validateSeed,
  validatelGAUpdate,
} = require("../services/operatorsevices");

//Register a new Operator
const operatorSignUp = async (req) => {
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

    //validate operator status

    const user_id = await getUserId(req);
    const userStatus = await User.findById(user_id);

    if (!userStatus.operator) {
      throw new Error("You need to be an operator to complete registration");
    }

    //validate operator data fields
    await validateOperatorData(req);

    //check if user already exist
    const userId = user_id;
    console.log(userId);
    const foundUser = await Operator.findOne({ userId });
    if (foundUser) {
      throw new Error("User already exist");
    }

    //validate nationality
    await validateNationality(req);

    // validate state
    await validateState(req);

    //validate Local Gaovernment Area
    await validatelGA(req);

    const foundNIN = await Operator.findOne({ nin });
    if (foundNIN) {
      throw new Error("NIN already in use, Please provide another NIN");
    }

    // Check if user uploaded a file
    const userPicture = req.file ? req.file.path : "";

    //create operator data in Database
    const operator = await Operator.create({
      fullName,
      phoneNumber,
      nationality,
      state,
      lga,
      sex: sex.toLowerCase(),
      dateOfBirth,
      nin,
      userId: user_id,
      userPicture,
    });

    console.log("Operator created successfully");

    return operator;
  } catch (error) {
    throw error;
  }
};

//Update Operator Profile
const operatorUpdate = async (req) => {
  try {
    let { fullName, phoneNumber, state, lga, sex } = req.body;

    const keys = ["fullName", "phoneNumber", "state", "lga", "sex"];
    const pattern = /^\d{11}$/;

    //validate operator input
    await requiredKeys(req, keys);

    //remove leading and trailing whitespaces if full name is defined
    if (fullName !== undefined) {
      fullName = fullName.trim();
    }

    //check if phoneNumber is defined and validate phone number
    if (phoneNumber !== undefined) {
      if (!pattern.test(phoneNumber)) {
        throw new Error("Please provide valid Phone Number");
      }
    }

    //check if sex is defined and valid sex type
    if (sex !== undefined) {
      sex = sex.toLowerCase().trim();
      if (!["male", "female", "other"].includes(sex.toLowerCase())) {
        throw new Error("Sex must either be Male, Female or Others");
      }
    }

    //validate state and lga values
    if (state !== undefined && lga !== undefined) {
      state = state.toLowerCase().trim();
      lga = lga.toLowerCase().trim();

      // Validate state and local government area
      await validateState(req);
      await validatelGA(req);
    } else if (state !== undefined) {
      throw new Error(
        "Changing your state will require you to change your LGA"
      );
    } else if (lga !== undefined) {
      const name = await validatelGAUpdate(req);
      const userId = await getUserId(req);
      const existingUser = await Operator.findOne({ userId });
      const stateName = existingUser.state;

      if (name !== stateName) {
        throw new Error("The new LGA does not belong to your current state");
      }
    }

    //obtain userId and update operator table
    const user_id = await getUserId(req);
    const userId = user_id;
    console.log(userId);

    //access database and update my operator profile
    const updatedOperator = await Operator.findOneAndUpdate(
      { userId },
      { $set: { fullName, phoneNumber, state, lga, sex } },
      {
        returnOriginal: false,
      }
    );

    console.log(updatedOperator);
    if (!updatedOperator) {
      throw new Error("No Operator Found");
    }

    return updatedOperator;
  } catch (error) {
    throw error;
  }
};

//update picture for operator
const updatePicture = async (req) => {
  try {
    const userPicture = req.file.path;
    console.log(userPicture);

    if (!req.file) {
      throw new Error("No image uploaded");
    }

    const user_id = await getUserId(req);
    const userId = user_id;
    console.log(userId);

    const pictureUpdate = await Operator.findOneAndUpdate(
      { userId },
      { $set: { userPicture } },
      { returnOriginal: false }
    );

    console.log(pictureUpdate);

    if (!pictureUpdate) {
      throw new Error("No Operator Found");
    }

    return "File Uploaded Successfully";
  } catch (error) {
    throw error;
  }
};

//Function to enable operator select product and seed type
const selectProduct = async (req) => {
  try {
    //define the input parameters
    const { product_id, seedId } = req.params;

    //obtain operator ID if operator is verified
    const operatorId = await getOperatorStatus(req);

    //check database to see if operator selection already exist
    const foundSelection = await Selection.findOne({ operatorId });
    if (
      foundSelection.product_id === product_id &&
      foundSelection.seedId === seedId
    ) {
      throw new Error(
        "You already have this Product and Seed Type in your collection"
      );
    }

    //validate Product
    await validateProduct(req);

    //validate seed type
    await validateSeed(req);

    //create operator selection table
    const operatorSelection = await Selection.create({
      operatorId,
      product_id,
      seedId,
    });

    console.log("Product Selection Successful");
    return operatorSelection;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  operatorSignUp,
  operatorUpdate,
  updatePicture,
  selectProduct,
};
