/* eslint-disable react/no-unescaped-entities */
import { auth } from "@clerk/nextjs/server";
import { supabaseServer } from "@/lib/supabase-server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function SavedJobsPage() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const { data: jobs, error } = await supabaseServer
    .from("parsed_jobs")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching jobs:", error.message);
    return <div className="p-6">Failed to load jobs.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-3xl font-bold text-[--primary]">📥 Saved Jobs</h1>
      <p className="text-muted-foreground text-lg">
        Here's everything you've parsed so far.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2 gap-6">
        {jobs.map((job) => (
          <Card key={job.id} className="rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-base">🗓 {new Date(job.created_at).toLocaleDateString("en-GB")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="font-medium">💼 Skills:</p>
              <ul className="list-disc list-inside">
                {job.skills?.map((skill: string, i: number) => <li key={i}>{skill}</li>)}
              </ul>

              <p className="font-medium mt-2">📚 Experience:</p>
              <ul className="list-disc list-inside">
                {job.experience?.map((exp: string, i: number) => <li key={i}>{exp}</li>)}
              </ul>

              {/* Placeholder for resume generation */}
              <Link href={`/dashboard/resume-generator?jobId=${job.id}`}>
                <Button className="mt-4 w-full" variant="default">
                  Generate Resume
                </Button>
              </Link>
              <Link href={`/dashboard/cover-letter-generator?jobId=${job.id}`}>
                <Button className="mt-2 w-full" variant="outline">
                  Generate Cover Letter
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
