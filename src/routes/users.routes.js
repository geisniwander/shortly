import { ranking, signIn, signUp } from "../controller/users.controller.js";
import { Router } from "express";
import {
  validSchemaSignin,
  validSchemaSignup,
} from "../middleware/users.middleware.js";

const userRouter = Router();

userRouter.post("/sign-up", validSchemaSignup, signUp);
userRouter.post("/sign-in", validSchemaSignin, signIn);
userRouter.get("/ranking", ranking);


export default userRouter;
