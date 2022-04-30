import express from "express";
import {
  authGuard,
  expressCallback,
  validatorCallback,
} from "../../middlewares";
import userController from "./auth.controller";

const authRouter = express.Router();

authRouter.post("/login", expressCallback(userController.login));
authRouter.post("/register", expressCallback(userController.register));
authRouter.get(
  "/userInfo",
  authGuard,
  expressCallback(userController.userInfo)
);

export default authRouter;
