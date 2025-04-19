import { auth } from "@clerk/nextjs/server";
import { supabaseServer } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

const allowedUserId = process.env.NEXT_PUBLIC_ALLOWED_USER_ID!;

export async function DELETE(req: Request) {
  const { userId } = await auth();
  const { searchParams } = new URL(req.url);
  const jobId = searchParams.get("jobId");

  if (userId !== allowedUserId) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  if (!userId || !jobId) {
    return NextResponse.json({ error: "Unauthorized or missing job ID" }, { status: 400 });
  }

  const { error } = await supabaseServer
    .from("parsed_jobs")
    .delete()
    .eq("id", jobId)
    .eq("user_id", userId);

  if (error) {
    console.error("Error deleting job:", error.message);
    return NextResponse.json({ error: "Failed to delete job" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
