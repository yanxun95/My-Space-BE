import express from "express";
import PostModel from "./schema.js";
import CommentModel from "../comments/schema.js";
import { JWTAuthMiddleware } from "../../auth/token.js";
import mongoose from "mongoose";
import createHttpError from "http-errors";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const postRouter = express.Router();

const cloudStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "MySpacePost",
  },
});

postRouter.post("/:profileId", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const newPost = new PostModel({
      ...req.body,
      user: mongoose.Types.ObjectId(req.params.profileId),
    });
    const { _id } = await newPost.save();

    res.status(201).send({ _id });
  } catch (error) {
    next(error);
  }
});

postRouter.get("/", async (req, res, next) => {
  try {
    const posts = await PostModel.find().populate("user");
    // likes

    res.send(posts);
  } catch (error) {
    next(error);
  }
});

postRouter.put("/:postId", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const postId = req.params.postId;

    const modifiedPost = await PostModel.findByIdAndUpdate(postId, req.body, {
      new: true,
    });

    if (modifiedPost) {
      res.send(modifiedPost);
    } else {
      next(createHttpError(404, `Post with id ${postId} is not found`));
    }
  } catch (error) {
    next(error);
  }
});

postRouter.delete("/:postId", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const postId = req.params.postId;

    const deletedPost = await PostModel.findByIdAndDelete(postId);
    if (deletedPost) {
      const deleteCommentWithPost = await CommentModel.find({
        postId: postId,
      });
      deleteCommentWithPost.forEach(async (element) => {
        const deleteComment = await CommentModel.findByIdAndDelete(element._id);
      });

      res.status(201).send("Post has been delete");
    } else {
      next(createHttpError(404, `Post with id ${postId} is not found`));
    }
  } catch (error) {
    next(error);
  }
});

postRouter.post(
  "/:postId/picture",
  JWTAuthMiddleware,
  multer({ storage: cloudStorage }).single("postImg"),
  async (req, res, next) => {
    try {
      const postId = req.params.postId;
      const postImage = await PostModel.findByIdAndUpdate(
        postId,
        { $set: { img: req.file.path } },
        { new: true }
      );
      res.send(postImage);
    } catch (error) {
      next(error);
    }
  }
);

postRouter.post(
  "/:postId/:userId/comment",
  JWTAuthMiddleware,
  async (req, res, next) => {
    try {
      const newComment = new CommentModel({
        ...req.body,
        user: mongoose.Types.ObjectId(req.params.userId),
        postId: mongoose.Types.ObjectId(req.params.postId),
      });
      const { _id } = await newComment.save();

      res.status(201).send({ _id });
    } catch (error) {
      next(error);
    }
  }
);

postRouter.get("/:postId/comment", async (req, res, next) => {
  try {
    const post = await CommentModel.find({
      postId: req.params.postId,
    }).populate("user");

    res.status(201).send(post);
  } catch (error) {
    next(error);
  }
});

postRouter.delete(
  "/comment/:commentId",
  JWTAuthMiddleware,
  async (req, res, next) => {
    try {
      const commentId = req.params.commentId;
      const deletedComment = await CommentModel.findByIdAndDelete(commentId);

      if (deletedComment) {
        res.status(204).send();
      } else {
        next(
          createHttpError(404, `Comment with id ${commentId} is not found `)
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

postRouter.put(
  "/comment/:commentId/",
  JWTAuthMiddleware,
  async (req, res, next) => {
    try {
      const commentId = req.params.commentId;
      const modifiedComment = await CommentModel.findByIdAndUpdate(
        commentId,
        req.body,
        {
          new: true,
        }
      );
      if (modifiedComment) {
        res.send(modifiedComment);
      } else {
        next(createHttpError(404, `Comment with id ${commentId} is not found`));
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

export default postRouter;
