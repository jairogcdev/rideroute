const User = require("../models/User.model");

const router = require("express").Router();

const bcrypt = require("bcryptjs");

const uploader = require("../middlewares/cloudinary.middleware");

const jwt = require("jsonwebtoken");

const isValidToken = require("../middlewares/user.middleware");
const { default: axios } = require("axios");
const MotoRoute = require("../models/MotoRoute.model");
const Comment = require("../models/Comment.model");

// POST "/api/user/signup" => Creates a new user account
router.post("/signup", async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      res
        .status(400)
        .json({ errorMessage: "You must fullfill all required fields" });
      return;
    }

    const regexEmail =
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;

    if (regexEmail.test(email) === false) {
      res.status(400).json({
        errorMessage: "The email is not valid",
      });
      return;
    }

    const regexPassword =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm;

    if (regexPassword.test(password) === false) {
      res.status(400).json({
        errorMessage:
          "Password must contain on upper case, one lower case, a number and at least 8 caracters",
      });
      return;
    }

    const salt = await bcrypt.genSalt(12);
    const cryptedPassword = await bcrypt.hash(password, salt);

    const foundUserName = await User.findOne({ username });
    const foundUserEmail = await User.findOne({ email });
    if (foundUserName) {
      res.status(400).json({
        errorMessage: "Username already taken",
      });
    }
    if (foundUserEmail) {
      res.status(400).json({
        errorMessage: "Email already taken",
      });
    }
    await User.create({ username, password: cryptedPassword, email });
    res.status(200).json("User created successfully");
  } catch (error) {
    next(error);
  }
});

// POST "/api/user/login" => Check if user is logged in
router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({
        errorMessage: "You must complete all required fields",
      });
      return;
    }

    const logedUser = await User.findOne({ username });
    if (!logedUser) {
      res.status(400).json({
        errorMessage: "Username not found",
      });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, logedUser.password);
    if (!isPasswordValid) {
      res.status(400).json({
        errorMessage: "Password is not valid",
      });
      return;
    }

    const payload = {
      _id: logedUser._id,
      username: logedUser.username,
      role: logedUser.role,
    };

    const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
      expiresIn: "2d",
    });
    res.status(200).json({ authToken });
  } catch (error) {
    next(error);
  }
});

// PATCH "/api/user/editUser" => Updates user account
router.patch("/editUser", isValidToken, async (req, res, next) => {
  try {
    const { username, email } = req.body;
    const userId = req.payload._id;
    if (!username) {
      res.status(400).json({
        errorMessage: "Username cannot be empty",
      });
    }
    if (!email) {
      res.status(400).json({
        errorMessage: "Email cannot be empty",
      });
    }
    await User.findByIdAndUpdate(userId, { username, email });
    res.status(200).json("User details updated");
  } catch (error) {
    next(error);
  }
});
// PATCH "/api/user/editMoto" => Updates user´s motorbike details
router.patch("/editMoto", isValidToken, async (req, res, next) => {
  try {
    const { maker } = req.body;
    if (maker.trim() === "") {
      res.json([]);
    } else {
      const response = await axios.get(
        `https://api.api-ninjas.com/v1/motorcycles?make=${maker}`,
        {
          headers: {
            "X-Api-Key": process.env.X_API_KEY,
          },
        }
      );
      const allModels = [...response.data].map((eachModel) => eachModel.model);
      res.json(allModels);
    }
  } catch (error) {
    next(error);
  }
});

// PATCH "/api/user/editMotorbikeDetails" => Edit Motorbike details in DB
router.patch("/editMotorbikeDetails", isValidToken, async (req, res, next) => {
  try {
    const { make, model, year } = req.body;
    const userId = req.payload._id;
    const updatedUser = { motoMake: make, motoModel: model, motoYear: year };
    await User.findByIdAndUpdate(userId, updatedUser);
    res.status(200).json("Motorbike details updated successfully");
  } catch (error) {
    next(error);
  }
});

// PATCH "/api/user/editUserPicture" => Updates user´s picture
router.patch("/editUserPicture", isValidToken, async (req, res, next) => {
  const userId = req.payload._id;
  const userPicture = req.body.userPicture;
  try {
    await User.findByIdAndUpdate(userId, { userPicture });

    res.status(200).json("User picture updated successfully");
  } catch (error) {
    next(error);
  }
});

// PATCH "/api/user/editMotoPicture" => Updates user´s motorbike picture
router.patch("/editMotorbikePicture", isValidToken, async (req, res, next) => {
  const userId = req.payload._id;
  const motoPicture = req.body.motoPicture;
  try {
    await User.findByIdAndUpdate(userId, { motoPicture });

    res.status(200).json("Motorbike picture updated successfully");
  } catch (error) {
    next(error);
  }
});

// PATCH "/api/user/uploadUserPicture" => Upload user´s picture
router.patch(
  "/uploadUserPicture",
  uploader.single("userPicture"),
  isValidToken,
  async (req, res, next) => {
    try {
      if (!req.file) {
        next("No file uploaded!");
        return;
      }
      res.json({ userPicture: req.file.path });
    } catch (error) {
      next(error);
    }
  }
);

// PATCH "/api/user/uploadMotoPicture" => Upload user´s motorbike picture
router.patch(
  "/uploadMotoPicture",
  uploader.single("motoPicture"),
  isValidToken,
  async (req, res, next) => {
    try {
      if (!req.file) {
        next("No file uploaded!");
        return;
      }
      res.json({ motoPicture: req.file.path });
    } catch (error) {
      next(error);
    }
  }
);

// DELETE "/api/user/delete"=> Delete user´s account
router.delete("/delete", isValidToken, async (req, res, next) => {
  try {
    const userId = req.payload._id;
    const routes = await MotoRoute.find({ user: { _id: userId } });
    await Comment.deleteMany({ route: routes });
    await Comment.deleteMany({ user: { _id: userId } });
    await MotoRoute.deleteMany({ user: { _id: userId } });
    await User.findByIdAndDelete(userId);
    res.status(200).json("The user has been deleted");
  } catch (error) {
    next(error);
  }
});

// GET "/api/user/info" => Get user details
router.get("/details", isValidToken, async (req, res, next) => {
  try {
    const userId = req.payload._id;
    const user = await User.findById(userId).select({
      _id: 0,
      password: 0,
      createdAt: 0,
      updatedAt: 0,
    });
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
});

// GET "/api/user/info" => Get user details
router.get("/getAllUsers", isValidToken, async (req, res, next) => {
  try {
    const user = await User.find();
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
});

// GET "/api/user/verify" => Indicar al front end si quien visita la página está activo y quien es
router.get("/verify", isValidToken, (req, res, next) => {
  res.json({ payload: req.payload });
});

module.exports = router;
