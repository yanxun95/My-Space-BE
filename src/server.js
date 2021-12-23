import express from "express";
import mongoose from "mongoose";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import {
  notFoundHandler,
  badRequestHandler,
  genericErrorHandler,
  unauthorizedHandler,
  forbiddenHandler,
} from "./errorHandlers.js";
import { createServer } from "http";
import userRouter from "./services/users/index.js";
import postRouter from "./services/posts/index.js";
import customiseRouter from "./services/customise/index.js";
import cookieParser from "cookie-parser";
// import createSocketServer from "./socket.js";

const app = express();
const httpServer = createServer(app);
// createSocketServer(httpServer);
const port = process.env.PORT || 3001;

// ************************* MIDDLEWARES ********************************
// passport.use("google", GoogleStrategy);

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
// app.use(cors());
app.use(cookieParser());
app.use(express.json());
// app.use(passport.initialize());

// ************************* ROUTES ************************************
app.use("/user", userRouter);
app.use("/post", postRouter);
app.use("/customise", customiseRouter);

// ************************** ERROR HANDLERS ***************************
app.use(notFoundHandler);
app.use(forbiddenHandler);
app.use(unauthorizedHandler);
app.use(badRequestHandler);
app.use(genericErrorHandler);

mongoose.connect(process.env.MONGO_CONNECTION);

mongoose.connection.on("connected", () => {
  console.log("Successfully connected to Mongo!");
  httpServer.listen(port, () => {
    console.table(listEndpoints(app));
    console.log(`Server running on port ${port}`);
  });
});

mongoose.connection.on("error", (err) => {
  console.log(err);
});
