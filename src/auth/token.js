import createHttpError from "http-errors";
import UserModel from "../services/users/schema.js";
import { verifyJWT } from "./tools.js";

export const JWTAuthMiddleware = async (req, res, next) => {
  // 1. Check if Authorization header is received, if it is not --> 401
  // console.log("COOKIES ", req.cookies);
  if (!req.headers.authorization) {
    // next(createHttpError(401, "Please provide credentials in Cookies!"));

    next(
      createHttpError(401, "Please provide credentials in Authorization header")
    );
  } else {
    try {
      // 2. If we receive Authorization header we extract the token from the header

      // const token = req.cookies.accessToken;
      const token = req.headers.authorization.replace("Bearer ", "");
      // console.log(token);
      // 3. Verify the token, if everything goes fine we are getting back the _id of the logged in user, otherwise an error will be thrown by jwt library

      const decodedToken = await verifyJWT(token);

      // console.log("DECODED TOKEN ", decodedToken);

      // 4. Find the user in db and attach him/her to the request object
      const user = await UserModel.findById(decodedToken._id);

      if (user) {
        req.user = user;
        next();
      } else {
        next(createHttpError(404, "User not found!"));
      }
    } catch (error) {
      next(createHttpError(403, "Forbidden!"));
    }
  }
};
