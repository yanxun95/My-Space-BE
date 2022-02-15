import express from "express";
import CustomiseModel from "./schema.js";
import { basicAuthMiddleware } from "../../auth/basic.js";
import { JWTAuthMiddleware } from "../../auth/token.js";
import createHttpError from "http-errors";
import mongoose from "mongoose";

const customiseRouter = express.Router();

customiseRouter.get("/:userId", async (req, res, next) => {
  try {
    const customiseId = await CustomiseModel.find({
      userId: req.params.userId,
    });
    if (customiseId) res.send(customiseId);
    else next(createHttpError(404, `User is not exist`));
  } catch (error) {
    next(error);
  }
});

customiseRouter.put("/", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const updatePosition = await CustomiseModel.findByIdAndUpdate(
      req.body._id,
      {
        userInfo: req.body.userInfo,
        userBgImage: req.body.userBgImage,
        mainPosition: req.body.mainPosition,
        postPosition: req.body.postPosition,
        upLeftContainerPosition: req.body.upLeftContainerPosition,
      },
      { new: true }
    );
    if (updatePosition) res.send(updatePosition);
    else next(createHttpError(404));
  } catch (error) {
    next(error);
  }
});

export default customiseRouter;
