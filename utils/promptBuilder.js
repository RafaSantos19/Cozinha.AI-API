export function buildRecipePrompt({ ingredients = [], user = {} }) {
  const {
    local = "",
    goals = [],
    appliances = [],
    allergies = [],
    diet = "",
    maxTime = 0,
    skillLevel = ""
  } = user || {};

  const has = (arr) => Array.isArray(arr) && arr.length > 0;
  const goalsTxt = has(goals) ? goals.join(", ") : "sem metas específicas";
  const appTxt = has(appliances) ? appliances.join(", ") : "fogão e utensílios básicos";
  const allergyTxt = has(allergies) ? allergies.join(", ") : "nenhuma";
  const timeTxt = maxTime && maxTime > 0 ? `${maxTime} minutos` : "até 60 minutos";
  const levelTxt = skillLevel || "iniciante";

  return `
Você é um chef brasileiro focado em acessibilidade e custo-benefício.
Gere EXATAMENTE 3 receitas em JSON. Cada receita DEVE respeitar as preferências do usuário.

DADOS DO USUÁRIO:
- Localidade: ${local || "Brasil"}
- Metas/objetivos: ${goalsTxt}
- Equipamentos disponíveis: ${appTxt}
- Alergias (PROIBIDO usar): ${allergyTxt}
- Dieta: ${diet || "livre"}
- Tempo máximo de preparo: ${timeTxt}
- Nível de habilidade: ${levelTxt}

INGREDIENTES DISPONÍVEIS:
${JSON.stringify(ingredients)}

REGRAS IMPORTANTES:
1) NUNCA use ingredientes listados em alergias. Se necessário, substitua e explique brevemente em "observacoes".
2) Adapte técnicas aos equipamentos disponíveis (ex.: se só airfryer, evite forno convencional).
3) Respeite dieta e metas. Ex.: “ganho de massa” → priorize proteínas; “perda de peso” → calorias controladas; “economia” → opções baratas.
4) Passos claros e sucintos (compatíveis com ${levelTxt}).
5) Tempo total de preparo ≤ ${timeTxt}.
6) Responda SOMENTE em JSON válido no formato descrito abaixo.

FORMATO JSON EXATO:
{
  "receitas": [
    {
      "nome": "string",
      "tempo_preparo_min": number,
      "dificuldade": "fácil" | "médio" | "difícil",
      "porcoes": number,
      "lista_ingredientes": ["string", "..."],
      "modo_preparo": ["Passo 1", "Passo 2", "..."],
      "tags": ["sem_gluten", "fit", "economico", "alto_proteico", "..."],
      "macro_estimada": { "kcal": number, "proteinas_g": number, "carbo_g": number, "gorduras_g": number },
      "observacoes": "string opcional com substituições e dicas"
    }
  ]
}
Responda apenas o JSON.
`;
}
