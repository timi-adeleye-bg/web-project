const mongoose = require("mongoose");

//create selection schema (Selection Table)
const selectionSchema = mongoose.Schema(
  {
    operatorId: {
      type: String,
      required: [true, "Please enter operator Id"],
      ref: "Operator.operatorId",
    },
    product_id: {
      type: String,
      required: true,
      ref: "Product.product_id",
    },
    seedId: {
      type: String,
      required: true,
      ref: "Seed.seedId",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Selection", selectionSchema);
