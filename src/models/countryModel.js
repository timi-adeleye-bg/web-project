const mongoose = require("mongoose");

//create countries schema (countries Table)
const countrySchema = mongoose.Schema(
  {
    nationality: {
      type: String,
      required: [true, "Please enter country name"],
      unique: [true, "Country already in use"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Country", countrySchema);
