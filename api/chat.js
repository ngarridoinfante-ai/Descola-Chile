export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.GEMINI_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "API key not configured" });
  }

  try {
    const { system, messages, max_tokens } = req.body;

    // Convert Anthropic-style messages to Gemini format
    const contents = (messages || []).map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: String(m.content || "") }],
    }));

    const geminiBody = {
      ...(system && { system_instruction: { parts: [{ text: system }] } }),
      contents,
      generationConfig: { maxOutputTokens: max_tokens || 1500 },
    };

    const model = "gemini-2.0-flash";
    const upstream = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(geminiBody),
      },
    );

    const data = await upstream.json();

    if (!upstream.ok) {
      return res
        .status(upstream.status)
        .json({ error: data?.error?.message || "Upstream error" });
    }

    // Normalize to Anthropic-like format so the frontend stays the same
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    res.status(200).json({ content: [{ type: "text", text }] });
  } catch (err) {
    res.status(500).json({ error: "Upstream error", message: err.message });
  }
}
