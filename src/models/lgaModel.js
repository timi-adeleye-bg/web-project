const mongoose = require("mongoose");

//create local Government Area schema (lGA Table)
const lGASchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter Local Government Area"],
      unique: [true, "Local Government Area already in use"],
    },
    state_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Please enter state ID"],
      ref: "State",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("lGA", lGASchema);
