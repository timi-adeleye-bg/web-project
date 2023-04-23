const mongoose = require("mongoose");

//create user Schema(user Table)
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
    },
    email: {
      type: String,
      required: [true, "Please enter your email address"],
      unique: [true, "Email already in use"],
    },
    password: {
      type: String,
      required: [true, "Please enter your password"],
    },
    operator: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
