import { auth } from "@clerk/nextjs/server";
import { supabaseServer } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId } = await auth();
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
