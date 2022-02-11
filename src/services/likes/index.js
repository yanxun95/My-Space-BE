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
    if (like) res.status(302).send(like);
    else next(createHttpError(404, `The user haven't like this post.`));
  } catch (error) {
    next(error);
  }
});

export default likeRouter;
