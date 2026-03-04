import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

dotenv.config();

//we are going to be writing a middleware, middleware is basically something which lies between the frontend and the controller, middleware and controller can be differentiated by the "next" in the parameters

/*
next → function that moves to the next step
If you call next(), Express moves to the controller.
If you send a response instead, the request stops here.*/
//tokens can be sent in two ways ->either by using headers, or -> by storing in cookies
export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization; // this is header method, where we will be storing our token along with a header,
  //if we look inside the browser, we will see three types of headers : general, request, response headers. inside request there are many headers and one among them is authorization
  //this authorization header starts off like "Bearer 'token'", so we use the split method to get the token alone

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized, missing token" });
  }

  const token = authHeader.split(" ")[1];
  /*
  If the header is:
Bearer abc123xyz
Then splitting by space gives:
["Bearer", "abc123xyz"]
Index [1] is the actual token.
So now:
token = "abc123xyz"*/

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // This checks whether the token was signed using the same secret key.
    console.log(decoded);

    const user = await User.findById(decoded.id).select("-password"); //“Return all fields except password.”
    if (!user) return res.status(401).json({ message: "Not authorized" });

    req.user = user; //we make use of req.user in controller all the time, so if we call next(), it takes us to the controller with the req.user
    next();
  } catch (error) {
    console.error("Token verification failed", error.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
