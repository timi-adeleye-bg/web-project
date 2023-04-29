const mongoose = require("mongoose");

//create operator Schema(operator Table)
const operatorSchema = new mongoose.Schema(
  {
    operatorId: {
      type: String,
      unique: true,
      default: function () {
        return "0-" + (Math.floor(Math.random() * 100000) + 1).toString();
      },
    },
    fullName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    nationality: {
      type: String,
      required: [true, "Enter valid Phone Number"],
    },
    state: {
      type: String,
      required: true,
    },
    lga: {
      type: String,
      required: true,
    },
    sex: {
      type: String,
      enum: ["male", "female", "other"],
      required: [true, "Enter valid data, Male/Female/Others"],
    },
    dateOfBirth: {
      type: Date,
      required: [true, "Enter valid Date"],
    },
    nin: {
      type: String,
      required: true,
      unique: [true, "NIN already exist"],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      unique: true,
      ref: "User",
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
    userPicture: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Operator", operatorSchema);
