import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

const MODEL = "gemini-2.5-flash";
const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY);

const GENERATION_CONFIG = {
  responseMimeType: "application/json",
  temperature: 0.8,
};

export async function generateJsonContent(prompt) {
  if (!prompt) {
    throw new Error("O prompt não pode estar vazio.");
  }

  try {
    const response = await genAI.models.generateContent({
      model: MODEL,
      contents: [{ role: "user", parts: [{ text: prompt }] }], 
      config: {
        ...GENERATION_CONFIG,
      }
    });
    
    return response.text; 

  } catch (error) {
    console.error("Erro ao chamar a API do Gemini:", error);
    throw new Error("Falha na geração de conteúdo.");
  }
}
