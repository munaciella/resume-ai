import { auth } from "@clerk/nextjs/server";
import { supabaseServer } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

const allowedUserId = process.env.NEXT_PUBLIC_ALLOWED_USER_ID!;

export async function POST(req: Request) {
  const { userId } = await auth();

  if (userId !== allowedUserId) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }
  
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { jobId, status, notes } = await req.json();

  const { error } = await supabaseServer.from("applications").insert({
    job_id: jobId,
    user_id: userId,
    status,
    notes,
  });

  if (error) {
    return NextResponse.json({ error: "Insert failed", details: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
