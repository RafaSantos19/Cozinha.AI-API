import RecipeService from "../services/RecipeService.js";

class RecipeController {
    constructor() {
        this.recipeService = new RecipeService();
    }

    async generateRecipes(req, res) {
        try {
            const { uid } = req.user;
            const { ingredients } = req.body;

            if (!uid || !ingredients) {
                return res.status(400).json({ message: "Valores inválidos" });
            }

            const recipes = await this.recipeService.generateRecipes(ingredients, uid);

            return res.status(201).json(recipes);
        } catch (error) {
            console.error("[RecipeController::generateRecipes]: ", error);
            return res.status(500).json({ message: "Erro ao criar receitas" });
        }
    }

    async getSuggestions(req, res) {
        try {
            const { uid } = req.user;

            if (!uid) {
                return res.status(400).json({ message: "UID do usuário não fornecido" });
            }

            const suggestions = await this.recipeService.getSuggestions(uid);

            return res.status(201).json(suggestions);
        } catch (error) {
            console.error("[RecipeController::getSuggestions]: ", error);
            return res.status(500).json({ message: "Erro ao obter sugestões de receitas" });
        }
    }

    async addFavorite(req, res) {
        try {
            const { uid } = req.user;
            const recipe = req.body;

            if (!uid || !recipe) {
                return res.status(400).json({ message: "Valores inválidos" });
            }

            const result = await this.recipeService.addFavorite(uid, recipe);

            return res.status(201).json({ message: result });
        } catch (error) {
            console.error("[RecipeController::addFavorite]: ", error);
            return res.status(500).json({ message: "Erro ao adicionar receita aos favoritos" });
        }
    }

    async getFavorites(req, res) {
        try {
            const { uid } = req.user;

            if (!uid) {
                return res.status(400).json({ message: "UID do usuário não fornecido" });
            }

            const favorites = await this.recipeService.getFavorites(uid);

            return res.status(201).json(favorites);
        } catch (error) {
            console.error("[RecipeController::getFavorites]: ", error);
            return res.status(500).json({ message: "Erro ao obter receitas favoritas" });
        }
    }       
}

export default RecipeController;