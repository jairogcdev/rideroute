const { default: axios } = require("axios");
const MotoRoute = require("../models/MotoRoute.model");
const User = require("../models/User.model");
const router = require("express").Router();
const isValidToken = require("../middlewares/user.middleware");
const Comment = require("../models/Comment.model");


//POST "/api/routes/create" => create a new route
router.post("/create", async (req, res, next) => {
  const { description, user, origin, destiny, country } = req.body;
  console.log(req.body);
  //check if description is filled up
  if (!description) {
    res.status(400).json({ errorMessage: "Description must be filled" });
    return;
  }
  //check if country is filled up
  if (!country) {
    res.status(400).json({ errorMessage: "Country must be filled" });
    return;
  }
  const coordinateRegex = /^[-+]?\d{1,2}(?:\.\d+)?,\s*[-+]?\d{1,3}(?:\.\d+)?$/;
  //check format of origin
  if (!coordinateRegex.test(origin)) {
    res.status(400).json({ errorMessage: "Origin must be filled" });
    return;
  }
  //check format of destiny
  if (!coordinateRegex.test(destiny)) {
    res.status(400).json({ errorMessage: "Destiny must be filled" });
    return;
  }

  try {
    await MotoRoute.create({ description, user, origin, destiny, country });
    res.status(200).json("MotoRoute created");
  } catch (err) {
    next(err);
  }
});

//PATCH "/api/routes/coordinates/searchOrigin" => Call to the API to search with adress
router.patch("/coordinates/searchOrigin", async (req, res, next) => {
  const { name, country } = req.body;
  if (name === "") {
    res
      .status(400)
      .json({ errorMessage: "You need to provide a City name in Origin" });
    return;
  }
  try {
    console.log("entrando a try");
    const responseAdress = await axios.get(
      `https://api.api-ninjas.com/v1/geocoding?city=${name}&country=${country}`,
      {
        headers: {
          "X-Api-Key": process.env.X_API_KEY,
        },
      }
    );
    res.json(responseAdress.data);
  } catch (err) {
    next(err);
  }
});
//PATCH "/api/routes/coordinates/searchDestiny" => Call to the API to search with adress
router.patch("/coordinates/searchDestiny", async (req, res, next) => {
  const { name, country } = req.body;
  if (name === "") {
    res
      .status(400)
      .json({ errorMessage: "You need to provide a City name in Destiny" });
    return;
  }
  try {
    const responseAdress = await axios.get(
      `https://api.api-ninjas.com/v1/geocoding?city=${name}&country=${country}`,
      {
        headers: {
          "X-Api-Key": process.env.X_API_KEY,
        },
      }
    );
    res.json(responseAdress.data);
  } catch (err) {
    next(err);
  }
});

//PATCH "/api/routes/:routeId/editRoute" => Find the route with the ID and update the coordinates
router.patch("/:routeID/editRoute", isValidToken, async (req, res, next) => {
    const userVerify = req.payload
    const {description, origin, destiny} = req.body;
    const routeEdit = {description, origin, destiny }
    try {
        const routeVerify = await MotoRoute.findById(req.params.routeID)
        if (routeVerify.user == userVerify._id){
            await MotoRoute.findByIdAndUpdate(req.params.routeID, routeEdit)
            res.status(200).json("success");
        } else {
            res.status(400).json({
                errorMessage: "User not owner of this route",
              });
        }



    }catch (err) {
        next(err);
    }
});

//DELETE "/api/routes/:routeId/delete" => Delete the route
router.delete("/:routeID/delete",isValidToken, async (req, res, next) => {
    const userVerify = req.payload
    try {
        const routeVerify = await MotoRoute.findById(req.params.routeID)
       
        if (routeVerify.user == userVerify._id){
            await Comment.deleteMany({route: routeVerify._id})
            await MotoRoute.findByIdAndDelete(req.params.routeID)
            res.status(200).json("success");
        } else {
            res.status(400).json({
                errorMessage: "User not owner of this route",
              });
        }


    }catch (err) {
        next(err);
    }
});

//PATCH "/api/routes/all" => List all routes

router.patch("/all", async (req, res, next) => {
  const {sendPage, pageSize} = req.body
  console.log(sendPage, pageSize)
  try {
    const response = await MotoRoute.find().populate({path:"user", select: [ "username", "motoMake", "motoModel", "userPicture", "motoPicture"]});
    const size = response.length
    const indexToSend = (sendPage * pageSize) - pageSize;
    console.log(indexToSend)
    const responseClone =  JSON.parse(JSON.stringify(response));
    const dataToSend = responseClone.splice(indexToSend,pageSize )
    const data = {
      routes: dataToSend,
      size
    }
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
});
//GET "/api/toutes/search" => search by username in DB

router.patch("/search", async (req, res, next) => { 
 const {value} = req.body
try {
  const userSearch = await User.find({username: value}).select({username: true})
  const data = await MotoRoute.find({user: userSearch}).populate({path:"user", select: [ "username", "motoMake", "motoModel", "userPicture", "motoPicture"]});
  res.status(200).json(data)
}catch (err) {
  next(err);
}


})


//GET "/api/routes/:routeId/info" => Get the route informationby the id from DB
router.get("/:routeID/info", async (req, res, next) => {
  try {
    const routeDetails = await MotoRoute.findById(req.params.routeID).populate({path:"user", select: [ "username", "motoMake", "motoModel", "userPicture", "motoPicture"]});
    res.status(200).json(routeDetails);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
