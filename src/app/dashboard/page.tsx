/* eslint-disable react/no-unescaped-entities */
import { auth, currentUser } from "@clerk/nextjs/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId) {
    throw new Error("Unauthorized user, please login");
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      <h1 className="text-3xl font-bold">
        Welcome, {user?.firstName || "Job Seeker"} 👋
      </h1>
      <p className="text-muted-foreground text-lg">
        Let’s help you land your next role with an AI-powered resume & cover letter.
      </p>

      <div className="grid gap-6 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>📄 Paste Job Description</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Start by pasting a job description. We'll extract key skills and tailor your resume.</p>
            <Button variant="default" size="sm">Go to Job Parser</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>📝 Generate Resume</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Use AI to create a resume based on your experience and the job requirements.</p>
            <Button variant="default" size="sm">Generate Resume</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>💌 Generate Cover Letter</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Craft a custom cover letter that matches the job role perfectly.</p>
            <Button variant="default" size="sm">Generate Cover Letter</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>📥 Saved Applications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Track and view your previously generated resumes, letters, and applications.</p>
            <Button variant="outline" size="sm">View Saved</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
