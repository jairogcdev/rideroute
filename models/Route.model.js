const { Schema, model } = require("mongoose");

const routeSchema = new Schema({
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
const Route = model("Route", routeSchema);

module.exports = Route;
