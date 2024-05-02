import { Router } from "express";
import {
  logInUser,
  logoutUser,
  registerUser,
} from "../controller/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const userRouter = Router();

userRouter.route("/registerUser").post(registerUser);

userRouter.route("/login").post(logInUser);
userRouter.route("/logout").post(verifyJWT, logoutUser);

export { userRouter };
