import { supabaseServer } from "@/lib/supabase-server";
import { auth } from "@clerk/nextjs/server"; // App router auth
import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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
    const parsed = JSON.parse(rawText || "{}");

    const { error } = await supabaseServer.from("parsed_jobs").insert({
      user_id: userId,
      job_text: jobDescription,
      skills: Array.isArray(parsed.skills) ? parsed.skills : [],
      experience: Array.isArray(parsed.experience) ? parsed.experience : [],
    });

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: "Database insert failed" },
        { status: 500 }
      );
    }

    return NextResponse.json(parsed);
  } catch (err) {
    console.error("JSON parse error:", err);
    return NextResponse.json(
      { error: "Invalid response format" },
      { status: 500 }
    );
  }
}
