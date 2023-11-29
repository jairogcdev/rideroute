const { Schema, model } = require("mongoose");
const commentSchema = new Schema(
  {
    comment: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    route: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Route",
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    createdAt: true,
    timestamps: true,
  }
);
const Comment = model("Comment", commentSchema);
module.exports = Comment;
