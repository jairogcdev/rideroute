const mongoose = require("mongoose");

const motoRouteSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  origin: {
    type: [Number],
    required: true,
  },
  destiny: {
    type: [Number],
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
});
const MotoRoute = mongoose.model("MotoRoute", motoRouteSchema);

module.exports = MotoRoute;
