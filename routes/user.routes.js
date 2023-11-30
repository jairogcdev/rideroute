const User = require("../models/User.model");

const router = require("express").Router();

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const isValidToken = require("../middlewares/user.middleware");
const { default: axios } = require("axios");

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
    res.json({ authToken });
  } catch (error) {
    next(error);
  }
});

// PATCH "/api/user/editUser" => Updates user account
router.patch("/editUser", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});
// PATCH "/api/user/editMoto" => Updates user´s motorbike details
router.patch("/editMoto", async (req, res, next) => {
  try {
    console.log(req.body);
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
router.patch("/editMotorbikeDetails", async (req, res, next) => {
  try {
    const { make, model, year } = req.body;
    const userId = req.body.user._id;
    const user = await User.findByIdAndUpdate(userId, {
      motoMake: make,
      motoModel: model,
      motoYear: year,
    });
    console.log(user);
  } catch (error) {
    next(error);
  }
});

// PATCH "/api/user/editUserPicture" => Updates user´s picture
router.patch("/editUserPicture", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});
// PATCH "/api/user/editMotoPicture" => Updates user´s motorbike picture
router.patch("/editMotoPicture", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

// DELETE "/api/user/delete"=> Delete user´s account
router.delete("/delete", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});
// GET "/api/user/info" => Get user details
router.get("/info", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

// GET "/api/user/verify" => Indicar al front end si quien visita la página está activo y quien es
router.get("/verify", isValidToken, (req, res, next) => {
  res.json({ payload: req.payload });
});

module.exports = router;
