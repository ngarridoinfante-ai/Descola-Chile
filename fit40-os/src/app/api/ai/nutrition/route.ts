import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { food_text, user_weight_kg } = await req.json();

    if (!food_text || typeof food_text !== "string" || food_text.length < 5) {
      return NextResponse.json({ error: "Texto de comida inválido" }, { status: 400 });
    }

    const protein_target = Math.round((user_weight_kg ?? 80) * 2.0);

    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 300,
      messages: [
        {
          role: "user",
          content: `Eres un nutricionista deportivo. Analiza esta comida y estima los macronutrientes totales del día.

Comida: "${food_text}"

Responde SOLO con un JSON válido con esta estructura exacta:
{
  "protein_g": número,
  "carbs_g": número,
  "fat_g": número,
  "calories": número,
  "notes": "una frase corta de feedback nutricional"
}

Contexto: hombre adulto activo, objetivo proteína ~${protein_target}g/día.
No incluyas texto fuera del JSON.`,
        },
      ],
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON in response");

    const result = JSON.parse(jsonMatch[0]);
    return NextResponse.json(result);
  } catch (err) {
    console.error("Nutrition AI error:", err);
    return NextResponse.json({ error: "Error al procesar" }, { status: 500 });
  }
}
