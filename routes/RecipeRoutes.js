import express from "express";
import { verifyToken } from "../middleware/TokenValidator.js";
import RecipeController from "../controller/RecipeController.js";

const recipeRouter = express.Router()
const recipeController = new RecipeController()

recipeRouter.post("/generate", verifyToken, recipeController.generateRecipes.bind(recipeController));
recipeRouter.post("/favorites", verifyToken, recipeController.addFavorite.bind(recipeController)); //Toggle favorite
recipeRouter.get("/suggestions", verifyToken, recipeController.getSuggestions.bind(recipeController));
recipeRouter.get("/suggestionDesc/:recipeName", verifyToken, recipeController.getSuggestionsByName.bind(recipeController));
recipeRouter.get("/getFavorites", verifyToken, recipeController.getFavorites.bind(recipeController));
recipeRouter.get("/favoriteDesc/:recipeName", verifyToken, recipeController.getFavoriteByName.bind(recipeController));

export default recipeRouter;