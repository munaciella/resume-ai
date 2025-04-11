import { NextResponse } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const { jobDescription } = await req.json();

  const prompt = `
You are an expert career assistant. Analyze the following job description and extract:
1. Key skills (as a list)
2. Relevant experiences or responsibilities (as a list)

Respond in JSON format like:
{
  "skills": [...],
  "experience": [...]
}

Job Description:
""" 
${jobDescription}
"""`;

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.4,
  });

  const rawText = completion.choices[0].message.content;

  try {
    const json = JSON.parse(rawText || "{}");
    return NextResponse.json(json);
  } catch (err) {
    console.error("JSON parse error:", err);
    return NextResponse.json({ error: "Invalid response format" }, { status: 500 });
  }
}
