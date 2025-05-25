const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema({
  name: { type: String, required: true },
  floorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Floor",
    required: true
  },
  position: {
    top: { type: Number, required: true },
    left: { type: Number, required: true }
  },
  available: { type: Boolean, default: true },
  member: { type: Number, default: 1 }
});

module.exports = mongoose.model("Table", tableSchema);
