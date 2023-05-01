const mongoose = require("mongoose");

//product schema (product Table)
const productSchema = mongoose.Schema(
  {
    product: {
      type: String,
      required: [true, "Please enter product name"],
      unique: [true, "Product already in use"],
    },
    product_id: {
      type: String,
      unique: true,
      default: function () {
        const prefix = this.product.substr(0, 2);
        const sep = "-";
        const num = Math.floor(Math.random() * 100) + 1;
        return prefix + sep + num;
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
