import { GenerateRecipeUseCase } from "../use-case/GenerateRecipeUseCase.js";
import Database from "../config/Database.js";
class RecipeService {
    constructor(){
        this.db = new Database();
        this.userColl = "user"
    }

    async generateRecipes(ingredients, userUid) {
        try {
            if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0 || !userUid) {
                throw new Error("Nenhum ingrediente fornecido.");
            }

            //TODO: Filtrar o retorno do user
            const user = await this.db.getDocByUid(userUid, this.userColl);
            //console.log("User: ", user);

            const recipes = await GenerateRecipeUseCase(ingredients, user);
            //console.log("Recipes: ", recipes);

            return recipes;
        } catch (error) {
            console.error("[RecipeService] Erro ao gerar receitas:", error);
            throw new Error("Falha ao gerar receitas com o Gemini.");
        }
    }
}

export default RecipeService;