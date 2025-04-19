import { auth } from "@clerk/nextjs/server";
import { supabaseServer } from "@/lib/supabase-server";
import { NextRequest, NextResponse } from "next/server";

const allowedUserId = process.env.NEXT_PUBLIC_ALLOWED_USER_ID!;

export async function GET(req: NextRequest) {
  const { userId } = await auth();

  if (userId !== allowedUserId) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }
  
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const sort = searchParams.get("sort");

  let query = supabaseServer
    .from("applications")
    .select(
      `
    *,
    parsed_jobs (
      id,
      created_at,
      skills,
      experience,
      resumes ( id ),
      cover_letters ( id )  
  )
  `
    )
    .eq("user_id", userId);

  if (status && status !== "All") {
    query = query.eq("status", status);
  }

  query = query.order("created_at", { ascending: sort === "asc" });

  const { data, error } = await query;

  if (error) {
    console.error("Fetch error:", error.message);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }

  return NextResponse.json(data);
}
