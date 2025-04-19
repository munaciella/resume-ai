import { auth } from "@clerk/nextjs/server";
import { supabaseServer } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

const allowedUserId = process.env.NEXT_PUBLIC_ALLOWED_USER_ID!;

export async function GET() {
  const { userId } = await auth();

  if (userId !== allowedUserId) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabaseServer
    .from("parsed_jobs")
    .select(
      `
      *,
      applications (
        status,
        notes
      ),
      resumes (
        id
      ),
      cover_letters (
         id
       )
    `
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching saved jobs:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch saved jobs" },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}
