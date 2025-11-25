import express from "express";
import { verifyToken } from "../middleware/TokenValidator.js";
import { requestLogger } from "../middleware/requestLogger.js";
import RecipeController from "../controller/RecipeController.js";

const recipeRouter = express.Router()
const recipeController = new RecipeController()

recipeRouter.post("/generate", requestLogger,verifyToken, recipeController.generateRecipes.bind(recipeController));
recipeRouter.post("/favorites", requestLogger, verifyToken, recipeController.addFavorite.bind(recipeController)); //Toggle favorite
recipeRouter.get("/suggestions", requestLogger, verifyToken, recipeController.getSuggestions.bind(recipeController));
recipeRouter.get("/suggestionDesc/:recipeName", requestLogger, verifyToken, recipeController.getSuggestionsByName.bind(recipeController));
recipeRouter.get("/getFavorites", requestLogger, verifyToken, recipeController.getFavorites.bind(recipeController));
recipeRouter.get("/favoriteDesc/:recipeName", requestLogger, verifyToken, recipeController.getFavoriteByName.bind(recipeController));

export default recipeRouter;