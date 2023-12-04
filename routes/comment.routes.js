const Comment = require("../models/Comment.model");
const MotoRoute = require("../models/MotoRoute.model");
const User = require("../models/User.model");

const router = require("express").Router();

// GET "/api/comment/:commentId => Obtains a comment by id"
router.get("/comment/:commentId"),
  async (req, res, next) => {
    try {
      const commentId = req.params.commentId;
      const comment = await Comment.findById(commentId);
      res.status(200).render({ comment });
    } catch (error) {
      next(error);
    }
  };

//POST "comment/:routeId/create" => Create a comment in a route
router.post("/comment/:routeId/create"),
  async (req, res, next) => {
    try {
      const routeId = req.params.routeId;
      const userId = req.body.user._id;
      const { comment } = req.body;
      const motoRoute = await MotoRoute.findById(routeId);
      const user = await User.findById(userId);
      await Comment.create({ comment, user, motoRoute });
      // $push: { contents: content._id },
      res.status(200).render("Comment created succesfully");
    } catch (error) {
      next(error);
    }
  };

//PUT "comment/:commentId/edit" => Update a comment
router.put("/comment/:commentId/edit"),
  async (req, res, next) => {
    try {
      const commentId = req.params.commentId;
      const { comment } = req.body;
      await Comment.findByIdAndUpdate(commentId, { comment });
      res.status(200).render("Comment updated succesfully");
    } catch (error) {
      next(error);
    }
  };

// DELETE /comment/:commentId/delete => Delete a comment
router.delete("/comment/:commentId/delete"),
  async (req, res, next) => {
    try {
      const commentId = req.params.commentId;
      await Comment.findByIdAndDelete(commentId);
    } catch (error) {
      next(error);
    }
  };

module.exports = router;
