import express from "express";
import UserModel from "./schema.js";
import CustomiseModel from "../customise/schema.js";
import { basicAuthMiddleware } from "../../auth/basic.js";
import { JWTAuthenticate } from "../../auth/tools.js";
import { JWTAuthMiddleware } from "../../auth/token.js";
import createHttpError from "http-errors";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import passport from "passport";
import mongoose from "mongoose";

const userRouter = express.Router();

const cloudStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "MySpaceUser",
  },
});

userRouter.post("/register", async (req, res, next) => {
  try {
    const newUser = new UserModel(req.body);
    const { _id } = await newUser.save();
    const customiseLocation = new CustomiseModel({
      userId: mongoose.Types.ObjectId(_id),
      userInfo: "0px, 0px, 0px",
      userBgImage: "0px, 0px, 0px",
      postUserInfo: "0px, 0px, 0px",
      postUserContent: "0px, 0px, 0px",
      postUserImage: "0px, 0px, 0px",
      postUserFunctionBar: "0px, 0px, 0px",
    });
    await customiseLocation.save();
    res.status(201).send({ _id });
  } catch (error) {
    next(error);
  }
});

userRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.checkCredentials(email, password);

    if (user) {
      const accessToken = await JWTAuthenticate(user);
      console.log({ token: accessToken });
      res
        .status(201)
        .cookie("accessToken", accessToken, {
          httpOnly: false,
        })
        .send({ _id: user._id });
    } else {
      next(createHttpError(401, "Credentials are not ok!"));
    }
  } catch (error) {
    next(error);
  }
});

userRouter.get("/", async (req, res, next) => {
  try {
    const user = await UserModel.find();
    res.send(user);
  } catch (error) {
    next(error);
  }
});

userRouter.get("/:id", async (req, res, next) => {
  try {
    const eachUser = await UserModel.findById(req.params.id);
    if (eachUser) res.send(eachUser);
    else
      next(
        createHttpError(404, `profile with id ${req.params.id} is not found`)
      );
  } catch (error) {
    next(error);
  }
});

userRouter.put("/:id", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const updateUser = await UserModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (updateUser) res.send(updateUser);
    else
      next(
        createHttpError(404, `profile with id ${req.params.id} is not found`)
      );
  } catch (error) {
    next(error);
  }
});

userRouter.post(
  "/:userId/userImage",
  JWTAuthMiddleware,
  multer({ storage: cloudStorage }).single("userImg"),
  async (req, res, next) => {
    try {
      const userId = req.params.userId;
      const userImage = await UserModel.findByIdAndUpdate(
        userId,
        { $set: { userImage: req.file.path } },
        { new: true }
      );
      res.send(userImage);
    } catch (error) {
      next(error);
    }
  }
);

userRouter.post(
  "/:userId/bgImage",
  JWTAuthMiddleware,
  multer({ storage: cloudStorage }).single("bgImg"),
  async (req, res, next) => {
    console.log(req.params.userId);
    try {
      const userId = req.params.userId;
      const bgImage = await UserModel.findByIdAndUpdate(
        userId,
        { $set: { bgImage: req.file.path } },
        { new: true }
      );
      res.send(bgImage);
    } catch (error) {
      next(error);
    }
  }
);

userRouter.get("/me", JWTAuthMiddleware, async (req, res, next) => {
  try {
    console.log(req.user);
    res.send(req.user);
  } catch (error) {
    next(error);
  }
});

export default userRouter;
