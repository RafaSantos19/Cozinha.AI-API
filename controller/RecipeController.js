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
}

export default RecipeController;