import { auth } from "@clerk/nextjs/server";
import { supabaseServer } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabaseServer
    .from("parsed_jobs")
    .select(`
      *,
      applications (
        status,
        notes
      )
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching saved jobs:", error.message);
    return NextResponse.json({ error: "Failed to fetch saved jobs" }, { status: 500 });
  }

  return NextResponse.json(data);
}
