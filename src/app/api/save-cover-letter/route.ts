import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

const allowedUserId = process.env.NEXT_PUBLIC_ALLOWED_USER_ID!;

export async function POST(req: Request) {
  const { userId } = await auth();

  if (userId !== allowedUserId) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }
  
  const { jobId, content } = await req.json();

  if (!userId || !jobId || !content) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const { error } = await supabaseServer.from("cover_letters").upsert({
    user_id: userId,
    job_id: jobId,
    content,
  });

  if (error) {
    console.error("Error saving cover letter:", error.message);
    return NextResponse.json({ error: "Failed to save cover letter" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
