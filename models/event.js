const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new mongoose.Schema({
  name: String,
  participants: {
    type: Number
  },
  days: {
    type: Number
  }
  // plastic: { type: String, enum: ["cups "], default: "cups" }
});

module.exports = mongoose.model("Event", schema);
