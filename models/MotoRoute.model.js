const { Schema, model } = require("mongoose");

const motoRouteSchema = new Schema({
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
const MotoRoute = model("MotoRoute", motoRouteSchema);

module.exports = MotoRoute;
