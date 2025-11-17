import { askGemini } from "../services/GeminiService.js";
import { buildRecipePrompt } from "../utils/promptBuilder.js";
import { RecipeListSchema } from "../utils/recipeSchema.js";
import { assertNoAllergensOrFix } from "../utils/validateAllergies.js";

export async function GenerateRecipeUseCase(ingredients, user) {
  const prompt = buildRecipePrompt({ ingredients, user });
  const data = await askGemini(prompt);

  const parsed = RecipeListSchema.parse(data);

  const safe = await assertNoAllergensOrFix(parsed, user?.allergies || []);

  //console.log("safe: ", safe.receitas)

  return safe.receitas;
}
