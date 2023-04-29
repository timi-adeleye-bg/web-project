const mongoose = require("mongoose");

//seed schema (seed Table)
const seedSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter seed name"],
      unique: [true, "seed already exist"],
    },
    seedId: {
      type: String,
      unique: true,
      default: function () {
        return "st-" + (Math.floor(Math.random() * 100) + 1).toString();
      },
    },
    product_id: {
      type: mongoose.Schema.Types.String,
      required: [true, "Please input product ID"],
      ref: "Product",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Seed", seedSchema);
