import express from "express";
import UserController from "../controller/UserController.js";
import { verifyToken } from "../middleware/TokenValidator.js";
import { requestLogger } from "../middleware/requestLogger.js";

const userRouter = express.Router();
const userController = new UserController();

userRouter.get("/uid", requestLogger, verifyToken, userController.getUserByUid.bind(userController));
userRouter.get("/email", requestLogger, verifyToken, userController.getUserByEmail.bind(userController));
userRouter.put("/update", requestLogger, verifyToken, userController.updateUser.bind(userController));
userRouter.delete("/delete", requestLogger, verifyToken, userController.deleteUser.bind(userController));

export default userRouter;