const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: String,
  time: String, // ví dụ "30 mins"
  rating: Number,
  price: { type: String, required: true }, // Changed from Number to String
  isBestSale: { type: Boolean, default: false },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true
  }
});

module.exports = mongoose.model("Food", foodSchema);
