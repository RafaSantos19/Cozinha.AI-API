import { generateJsonContent } from "../config/gemini.js";

export async function askGemini(prompt) {
  try {
    const result = await generateJsonContent(prompt);
    return JSON.parse(result);
  } catch (error) {
    console.error("[GeminiService] Erro:", error);
    throw new Error("Erro ao se comunicar com o Gemini");
  }
}

export async function fixWithModel(prompt) {
  // mesma ideia, mas separado sem logs extras
  const result = await generateJsonContent(prompt);
  return JSON.parse(result);
}
