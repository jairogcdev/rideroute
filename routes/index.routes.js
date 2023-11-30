const router = require("express").Router();

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

const userRoute = require("./user.routes");
router.use("/user", userRoute);

const motoRoute = require("./motoRoute.routes");
router.use("/routes", motoRoute);

const commentRoute = require("./comment.routes");
router.use("/comments", commentRoute);

module.exports = router;
