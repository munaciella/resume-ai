import { auth } from "@clerk/nextjs/server";
import { supabaseServer } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

const allowedUserId = process.env.NEXT_PUBLIC_ALLOWED_USER_ID!;

export async function POST(req: Request) {
  const { userId } = await auth();

  if (userId !== allowedUserId) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }
  
  const { content, jobId } = await req.json();

  if (!userId || !content || !jobId) {
    return NextResponse.json({ error: "Missing data" }, { status: 400 });
  }

  const { error } = await supabaseServer.from("resumes").insert({
    user_id: userId,
    job_id: jobId,
    content,
  });

  if (error) {
    console.error("Supabase save error:", error.message);
    return NextResponse.json({ error: "Failed to save resume" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
