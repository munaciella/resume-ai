'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type ParsedResult = {
  id: string;
  skills: string[];
  experience: string[];
};

export default function JobParserPage() {
  const [jobDescription, setJobDescription] = useState('');
  const [result, setResult] = useState<ParsedResult | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleExtract = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/extract', {
        method: 'POST',
        body: JSON.stringify({ jobDescription }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();
      setResult(data); // Make sure your /api/extract returns the `id` of the new job
    } catch (err) {
      console.error('Extraction failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-3xl font-bold text-primary">🧠 Job Description Parser</h1>
      <p className="text-muted-foreground">
        Paste a job description below and we&apos;ll extract relevant skills, qualifications, and requirements.
      </p>

      <Textarea
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        placeholder="Paste job description here..."
        rows={10}
        className="resize-none"
      />

      <Button onClick={handleExtract} disabled={loading}>
        {loading ? <Loader2 className="animate-spin h-4 w-4" /> : 'Extract Key Skills'}
      </Button>

      {result && (
        <>
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>🧩 Extracted Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {result.skills && (
                <div>
                  <p className="font-medium">💼 Skills:</p>
                  <ul className="list-disc list-inside text-sm">
                    {result.skills.map((skill: string, i: number) => <li key={i}>{skill}</li>)}
                  </ul>
                </div>
              )}
              {result.experience && (
                <div>
                  <p className="font-medium">📚 Experience:</p>
                  <ul className="list-disc list-inside text-sm">
                    {result.experience.map((exp: string, i: number) => <li key={i}>{exp}</li>)}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex flex-wrap gap-4 pt-4">
            <Button variant="secondary" onClick={() => router.push("/dashboard/saved")}>
              📥 View Saved Jobs
            </Button>
            <Button variant="default" onClick={() => router.push(`/dashboard/resume-generator?jobId=${result.id}`)}>
              📄 Generate Resume
            </Button>
            <Button variant="default" onClick={() => router.push(`/dashboard/cover-letter-generator?jobId=${result.id}`)}>
              💌 Generate Cover Letter
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
