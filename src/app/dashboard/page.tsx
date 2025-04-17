/* eslint-disable react/no-unescaped-entities */
import { auth, currentUser } from "@clerk/nextjs/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function DashboardPage() {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId) {
    throw new Error("Unauthorized user, please login");
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-14 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-primary">
          Welcome, {user?.firstName || "Job Seeker"} 👋
        </h1>
        <p className="text-muted-foreground text-lg">
          Let’s help you land your next role with an AI-powered resume & cover
          letter.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Card className="hover:shadow-lg transition-shadow duration-300 rounded-xl">
          <CardHeader>
            <CardTitle>📄 Paste Job Description</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Start by pasting a job description. We'll extract key skills and
              tailor your resume.
            </p>
            <Link href="/dashboard/job-parser">
              <Button
                variant="default"
                className="w-full cursor-pointer"
                aria-label="Go to Job Parser"
              >
                Go to Job Parser
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-300 rounded-xl">
          <CardHeader>
            <CardTitle>📥 Saved Job Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              View and edit your previously saved job skills and experience
              based on the job description.
            </p>
            <Link href={"/dashboard/saved"}>
              <Button
                variant="outline"
                className="w-full cursor-pointer"
                aria-label="View Saved Applications"
              >
                View Saved Job Details
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-300 rounded-xl">
          <CardHeader>
            <CardTitle>📋 Job Application Tracker</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>View, edit, sort and filter all saved job applications</p>
            <Link href={"/dashboard/job-applications"}>
              <Button
                variant="default"
                className="w-full cursor-pointer"
                aria-label="Job Application Tracker"
              >
                View Applications
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-300 rounded-xl">
          <CardHeader>
            <CardTitle>📝 Add New Job</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Create a new job to the application tracker and add notes.</p>
            <Link href={"/dashboard/job-applications/new"}>
              <Button
                variant="default"
                className="w-full cursor-pointer"
                aria-label="Add New Job Application"
              >
                Add New Application
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
