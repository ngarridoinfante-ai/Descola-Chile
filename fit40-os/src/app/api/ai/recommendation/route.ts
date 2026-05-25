import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { context } = await req.json();

    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 200,
      messages: [
        {
          role: "user",
          content: `Eres un coach de fitness y nutrición para hombres de 40+.

Contexto del usuario esta semana:
${JSON.stringify(context, null, 2)}

Da una recomendación diaria concisa (2-3 oraciones máximo), específica, accionable y directa.
No uses listas. No repitas el contexto. Habla directamente al usuario.`,
        },
      ],
    });

    const recommendation =
      message.content[0].type === "text" ? message.content[0].text.trim() : "";

    return NextResponse.json({ recommendation });
  } catch (err) {
    console.error("Recommendation AI error:", err);
    return NextResponse.json({ error: "Error al generar recomendación" }, { status: 500 });
  }
}
