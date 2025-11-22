import { GenerateRecipeUseCase } from "../use-case/GenerateRecipeUseCase.js";
import Database from "../config/Database.js";
import { ca } from "zod/locales";
class RecipeService {
    constructor() {
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
            //console.log(recipes);

            await this.db.addSuggestion(userUid, recipes);

            return recipes;
        } catch (error) {
            console.error("[RecipeService] Erro ao gerar receitas:", error);
            throw new Error("Falha ao gerar receitas com o Gemini.");
        }
    }

    async getSuggestions(userUid) {
        try {
            if (!userUid) {
                throw new Error("UID do usuário não informado");
            }
            const suggestions = await this.db.getSuggestions(userUid);
            return suggestions;
        } catch (error) {
            console.error("[RecipeService] Erro ao obter sugestões:", error);
            throw new Error("Falha ao obter sugestões de receitas.");
        }
    }

    async getSuggestionsByName(userUid, recipeName) {
        try {
            if (!userUid || !recipeName) { 
                throw new Error("UID do usuário ou nome da receita não informados");
            }
            const suggestion = await this.db.getSuggestionByName(userUid, recipeName);
            return suggestion;
        } catch (error) {
            console.error("[RecipeService] Erro ao obter sugestão por nome:", error);
            throw new Error("Falha ao obter sugestão de receita por nome.");
        }   
    }            

    async addFavorite(userUid, recipe) {
        try {
            if (!userUid || !recipe) {
                throw new Error("UID do usuário ou receita não informados");
            }
           const result = await this.db.addFavorite(userUid, recipe);

           return result.message;
        } catch (error) {
            console.error("[RecipeService] Erro ao adicionar receita favorita:", error);
            throw new Error("Falha ao adicionar receita aos favoritos.");
        }
    }
    
    async getFavorites(userUid) {
        try {
            if (!userUid) {
                throw new Error("UID do usuário não informado");
            }
            const favorites = await this.db.getUserFavorites(userUid);
            return favorites;
        } catch (error) {
            console.error("[RecipeService] Erro ao obter receitas favoritas:", error);
            throw new Error("Falha ao obter receitas favoritas.");
        }    
    }
    
    async getFavoriteByName(userUid, recipeName) {
        try {
            if (!userUid || !recipeName) {
                throw new Error("UID do usuário ou nome da receita não informados");
            }
            const favorite = await this.db.getFavoriteByName(userUid, recipeName);
            return favorite;
        } catch (error) {
            console.error("[RecipeService] Erro ao obter receita favorita por nome:", error);
            throw new Error("Falha ao obter receita favorita por nome.");
        }
    }       

}

export default RecipeService;