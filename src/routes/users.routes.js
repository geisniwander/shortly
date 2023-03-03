import { ranking, signIn, signUp, userMe } from "../controller/users.controller.js";
import { Router } from "express";
import {
  validSchemaSignin,
  validSchemaSignup,
} from "../middleware/users.middleware.js";
import { authValidation } from "../middleware/auth.middleware.js";

const userRouter = Router();

userRouter.post("/sign-up", validSchemaSignup, signUp);
userRouter.post("/sign-in", validSchemaSignin, signIn);
userRouter.get("/ranking", ranking);
userRouter.get("/users/me", authValidation,userMe);



export default userRouter;
