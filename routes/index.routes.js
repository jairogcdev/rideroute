const router = require("express").Router();

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

const authRoute = require("./auth.routes");
router.use("/auth", authRoute);

module.exports = router;
