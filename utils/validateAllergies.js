export async function assertNoAllergensOrFix(recipeList, allergies = []) {
  if (!allergies?.length) return recipeList;

  const banned = new Set(allergies.map(a => a.toLowerCase()));
  const hasBanned = (item) =>
    Array.from(banned).some(b => item.toLowerCase().includes(b));

  let invalid = false;
  for (const r of recipeList.receitas) {
    if (r.lista_ingredientes.some(hasBanned)) {
      invalid = true; break;
    }
  }

  if (!invalid) return recipeList;
  
  const { fixWithModel } = await import("../services/GeminiService.js");
  const fixPrompt = `
Corrija o JSON abaixo SUBSTITUINDO ingredientes proibidos (${Array.from(banned).join(", ")})
por alternativas seguras comuns no Brasil. Mantenha técnicas compatíveis e o mesmo formato.

JSON:
${JSON.stringify(recipeList)}

Responda apenas o JSON no MESMO formato.
`;
  const fixed = await fixWithModel(fixPrompt);
  return fixed;
}
