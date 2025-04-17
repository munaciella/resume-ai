import { auth } from "@clerk/nextjs/server";
import { OpenAI } from "openai";
import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function GET(req: NextRequest) {
  const { userId } = await auth();
  const { searchParams } = new URL(req.url);
  const jobId = searchParams.get("jobId");

  if (!userId || !jobId) {
    return NextResponse.json({ error: "Unauthorized or missing job ID" }, { status: 401 });
  }

  const { data: job, error } = await supabaseServer
    .from("parsed_jobs")
    .select("skills, experience")
    .eq("id", jobId)
    .single();

  if (error || !job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  const prompt = `
You are a professional cover letter writer generating markdown-formatted letters for junior developers.

Write a clear, tailored, and impactful **cover letter** using the format and tone below. Focus on:
- Highlighting the candidate’s technical skills
- Showing enthusiasm for learning and teamwork
- Using a friendly and confident tone
- Avoiding repetition and fluff

Insert the user's extracted **skills** and **experience** where appropriate.

---

[Your Full Name]  
Junior Software Developer  
[City, Country] | [Your Phone Number] | [Your Email] | [LinkedIn URL]  
[Today’s Date]  

[Company Name]  
[Company Address]  
[City, Postcode]  

Dear Hiring Manager,

I am excited to submit my application for the [Job Title] role at [Company Name]. With experience in ${job.skills.join(", ")}, and a passion for growth and collaboration, I’m confident in my ability to contribute to your team.

Throughout my career and projects, I’ve developed:
- ${job.experience.slice(0, 2).map((item: string) => `✅ ${item}`).join("\n- ")}

I’m particularly drawn to your company’s commitment to innovation and learning. I believe my technical foundation, problem-solving mindset, and enthusiasm for teamwork make me a strong fit for this role.

Thank you for considering my application. I’m available for an interview at your convenience and look forward to hearing from you.

Warm regards,  
[Your Full Name]
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
  });

  return NextResponse.json({ content: completion.choices[0].message.content });
}
