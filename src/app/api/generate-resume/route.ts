import { supabaseServer } from "@/lib/supabase-server";
import { OpenAI } from "openai";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { userId } = await auth();
  const url = new URL(req.url);
  const jobId = url.searchParams.get("jobId");

  if (!userId || !jobId) {
    return NextResponse.json({ error: "Unauthorized or missing job ID" }, { status: 400 });
  }

  const { data: job, error } = await supabaseServer
    .from("parsed_jobs")
    .select("*")
    .eq("id", jobId)
    .eq("user_id", userId)
    .single();

  if (error || !job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

  const prompt = `
You are a career assistant AI helping job seekers create tailored resumes for specific roles.

Please generate a professional resume **strictly in markdown format**, including the following sections:

## Contact Information
> _(Please add your full name, phone number, location, email, and links manually here)_

## Personal Statement
- A short paragraph tailored to a frontend developer role.

## Technical Skills & Expertise
Group into categories and format like this:

### Frontend
- React
- Next.js
- TailwindCSS

### Tools
- Git
- REST APIs

### Authentication
- Firebase
- Clerk

## Key Achievements
- 3 bullet points describing impactful contributions.

## Projects
Provide 2 fictional yet realistic projects (name, description, tech stack).

## Experience
Include 2 previous roles:

**Job Title**, **Company** – *Dates*  
A 2–3 sentence description of work and impact.

## Education
> _(You can add your degree, school, and graduation year manually here if relevant)_

Skills: ${job.skills.join(", ")}  
Experience: ${job.experience.join(", ")}

Respond in **well-structured Markdown only**, using clear headings (##) and bullet points.
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.5,
  });

  return NextResponse.json({ content: completion.choices[0].message.content });
}
