import express from "express";
import UserController from "../controller/UserController.js";
import { verifyToken } from "../middleware/TokenValidator.js";

const userRouter = express.Router();
const userController = new UserController();

userRouter.get("/uid", verifyToken, userController.getUserByUid.bind(userController));
userRouter.get("/email", verifyToken, userController.getUserByEmail.bind(userController));
userRouter.put("/update", verifyToken, userController.updateUser.bind(userController));
userRouter.delete("/delete", verifyToken, userController.deleteUser.bind(userController));

export default userRouter;