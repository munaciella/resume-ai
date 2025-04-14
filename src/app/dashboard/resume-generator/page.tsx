"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function ResumeGeneratorPage() {
  const searchParams = useSearchParams();
  const jobId = searchParams?.get("jobId") || null;

  const [loading, setLoading] = useState(true);
  const [resume, setResume] = useState("");
  const [editing, setEditing] = useState(false);

    const router = useRouter();

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const res = await fetch(`/api/generate-resume?jobId=${jobId}`);
        const data = await res.json();
        setResume(data.content);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (jobId) fetchResume();
  }, [jobId]);

  const handleSave = async () => {
    if (!resume || !jobId) return;

    const res = await fetch("/api/save-resume", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId, content: resume }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Save error:", data?.error || "Unknown error");
    } else {
      alert("✅ Resume saved!");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-60">
        <Loader2 className="animate-spin text-primary w-16 h-16" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-3xl font-bold text-[--primary]">
        📄 Resume Generator
      </h1>

      <div className="flex justify-end gap-3">
        <Button onClick={() => setEditing((prev) => !prev)} variant="outline">
          {editing ? "Preview" : "Edit"}
        </Button>
        <Button onClick={handleSave} variant="default">
          <Save className="w-4 h-4 mr-2" /> Save
        </Button>
        <Button variant="secondary" onClick={() => router.push("/dashboard/saved")}>
              📥 View Saved Job Details
            </Button>
      </div>

      {editing ? (
        <Textarea
          value={resume}
          onChange={(e) => setResume(e.target.value)}
          rows={25}
          className="w-full"
        />
      ) : (
        <div
          id="resume-preview"
          className="prose prose-neutral dark:prose-invert max-w-none bg-background text-foreground p-6 rounded-md"
        >
          <ReactMarkdown
            components={{
              h1: ({ ...props }) => (
                <h1 className="text-3xl font-bold mt-8 mb-4" {...props} />
              ),
              h2: ({ ...props }) => (
                <h2 className="text-2xl font-semibold mt-6 mb-3" {...props} />
              ),
              h3: ({ ...props }) => (
                <h3 className="text-xl font-medium mt-4 mb-2" {...props} />
              ),
              ul: ({ ...props }) => (
                <ul
                  className="list-disc list-inside space-y-1 mb-4"
                  {...props}
                />
              ),
              li: ({ ...props }) => (
                <li className="leading-relaxed" {...props} />
              ),
              p: ({ ...props }) => (
                <p className="mb-4 leading-relaxed" {...props} />
              ),
            }}
          >
            {resume}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
}
