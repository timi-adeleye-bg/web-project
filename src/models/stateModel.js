const mongoose = require("mongoose");

//create state schema (state Table)
const stateSchema = mongoose.Schema(
  {
    stateName: {
      type: String,
      required: [true, "Please enter state name"],
      unique: [true, "State already in use"],
    },
    country_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Please input country ID"],
      ref: "Country",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("State", stateSchema);
