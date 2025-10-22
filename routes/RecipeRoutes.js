import express from "express";
import { verifyToken } from "../middleware/TokenValidator.js";
import RecipeController from "../controller/RecipeController.js";

const recipeRouter = express.Router()
const recipeController = new RecipeController()

recipeRouter.post("/generate", verifyToken, recipeController.generateRecipes.bind(recipeController));

export default recipeRouter;