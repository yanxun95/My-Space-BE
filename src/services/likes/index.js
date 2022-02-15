import express from "express";
import LikeModel from "./schema.js";
import createHttpError from "http-errors";
import mongoose from "mongoose";

const likeRouter = express.Router();

likeRouter.get("/:postId/:userId", async (req, res, next) => {
  try {
    const like = await LikeModel.find({
      postId: mongoose.Types.ObjectId(req.params.postId),
      userId: mongoose.Types.ObjectId(req.params.userId),
    });
    like.length > 0 ? res.send(true) : res.send(false);
  } catch (error) {
    next(error);
  }
});

export default likeRouter;
