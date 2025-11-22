import { z } from "zod";

const MacroSchema = z.object({
  kcal: z.number().nonnegative(),
  proteinas_g: z.number().nonnegative(),
  carbo_g: z.number().nonnegative(),
  gorduras_g: z.number().nonnegative(),
});

const RecipeSchema = z.object({
  nome: z.string().min(2),

  tempo_preparo_min: z.number().int().positive(),

  dificuldade: z.enum(["fácil", "médio", "difícil"]),

  porcoes: z.number().int().positive(),

  lista_ingredientes: z.array(z.string().min(1)).min(1),

  categoria: z.enum([
    "café_da_manhã",
    "almoço",
    "jantar",
    "lanche",
    "sobremesa",
    "outro"
  ]),

  rating_estimado: z.number().min(0).max(5),

  imagem: z.string().min(1), // emoji ou string qualquer

  modo_preparo: z.array(z.string().min(3)).min(1),

  tags: z.array(z.string()).optional().default([]),

  macro_estimada: MacroSchema,

  observacoes: z.string().optional().default(""),
});

export const RecipeListSchema = z.object({
  receitas: z.array(RecipeSchema).min(1),
});
