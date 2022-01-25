import createHttpError from "http-errors";
import atob from "atob";
import UserModel from "../services/users/schema.js";

export const basicAuthMiddleware = async (req, res, next) => {
  // console.log(req.headers)
  // 1. Check if Authorization header is received, if it is not --> trigger an error (401)
  if (!req.headers.authorization) {
    next(
      createHttpError(401, "Please provide credentials in Authorization header")
    );
  } else {
    // console.log(req.headers.authorization);
    // 2. If we have received the Authorization header we will need to extract the credentials from it (which is base64 encoded, therefore we should translate it obtaining normal text)
    const decodedCredentials = atob(req.headers.authorization.split(" ")[1]);
    // console.log(decodedCredentials);

    const [email, password] = decodedCredentials.split(":");
    // console.log("EMAIL ", email);
    // console.log("PASSWORD ", password);

    // 3. Once we obtain plain credentials (diego@strive.com:1234), we need to find the user in db, compare received pw with the hashed one, if they are not ok --> trigger an error (401)

    const user = await UserModel.checkCredentials(email, password);
    if (user) {
      // 4. If the credentials were ok we can proceed to what is next (another middleware, route handler)
      req.user = user; // we are attaching to the request the user document
      next();
    } else {
      // credentials problems --> user was null
      next(createHttpError(401, "Credentials are not correct!"));
    }
  }
};
