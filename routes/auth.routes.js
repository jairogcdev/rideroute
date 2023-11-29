const User = require("../models/User.model");

const router = require("express").Router();

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

router.get("/users", async (req, res, next) => {
  try {
    const response = await User.find();
    res.json(response);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = router;
