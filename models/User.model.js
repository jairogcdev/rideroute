const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      required: false,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    profilePic: String,
    motoMake: {
      type: String,
    },
    motoModel: {
      type: String,
    },
    motoYear: {
      type: Number,
    },
    userPicture: {
      type: String,
      default:
        "https://img2.freepng.es/20180722/gfc/kisspng-user-profile-2018-in-sight-user-conference-expo-5b554c0968c377.0307553315323166814291.jpg",
    },
    motoPicture: {
      type: String,
      default:
        "https://www.inforchess.com/images/motocicletas/ducati-gp-0027.jpg",
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    createdAt: true,
    timestamps: true,
  }
);
const User = model("User", userSchema);
module.exports = User;
