//import required modules
const express = require("express");
const operatorRoute = express.Router();
const {
  createOperator,
  updateOperator,
  pictureUpdate,
} = require("../controllers/operatorController");
const { authToken } = require("../middlewares/authUser");
const multer = require("multer");

//configure storage to manage pictures uploaded on the server
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

//store pictures in the upload folder
const upload = multer({
  storage: storage,
  onError: function (err, next) {
    console.log(err);
    next(err);
  },
});

//route to register an operator
operatorRoute.post(
  "/register",
  authToken,
  upload.single("userPicture"),
  createOperator
);

//route to update operator profile
operatorRoute.put("/updateoperator", authToken, updateOperator);

//route to update operator picture
operatorRoute.put(
  "/updatepicture",
  authToken,
  upload.single("userPicture"),
  pictureUpdate
);

module.exports = operatorRoute;
