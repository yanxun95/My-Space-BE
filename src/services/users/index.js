import express from "express";
import UserModel from "./schema.js";
import { basicAuthMiddleware } from "../../auth/basic.js";
import { JWTAuthenticate } from "../../auth/tools.js";
import { JWTAuthMiddleware } from "../../auth/token.js";
import createHttpError from "http-errors";
import passport from "passport";

const userRouter = express.Router();

userRouter.post("/register", async (req, res, next) => {
  try {
    const newUser = new UserModel(req.body);
    const { _id } = await newUser.save();
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
      res.send({ accessToken });
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

userRouter.get("/me", JWTAuthMiddleware, async (req, res, next) => {
  try {
    console.log(req.user);
    res.send(req.user);
  } catch (error) {
    next(error);
  }
});

export default userRouter;