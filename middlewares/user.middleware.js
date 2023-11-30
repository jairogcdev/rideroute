const jwt = require("jsonwebtoken");

const isValidToken = (req, res, next) => {
  try {
    const token = req.headers.authorization.replace("Bearer ", "");
    const payload = jwt.verify(token, process.env.TOKEN_SECRET);
    req.payload = payload;
    next();
  } catch (error) {
    res.status(401).json("The token is not valid");
  }
};

module.exports = isValidToken;
