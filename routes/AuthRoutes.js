import express from "express";
import AuthController from "../controller/AuthController.js";
import { requestLogger } from "../middleware/requestLogger.js";

const authRouter = express.Router();
const authController = new AuthController();

authRouter.post("/signup", requestLogger, authController.userSignUp.bind(authController));
authRouter.post("/login", requestLogger, authController.userLogin.bind(authController)); 
authRouter.post("/passwordReset", requestLogger, authController.userPasswordReset.bind(authController));

export default authRouter;