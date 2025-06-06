'use client';

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";

export default function CoverLetterGeneratorPageContent() {
  const searchParams = useSearchParams();
  const jobId = searchParams?.get("jobId") || null;

  const [loading, setLoading] = useState(true);
  const [coverLetter, setCoverLetter] = useState("");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchCoverLetter = async () => {
      try {
        const res = await fetch(`/api/generate-cover-letter?jobId=${jobId}`);
        const data = await res.json();
        setCoverLetter(data.content);
      } catch (err) {
        console.error("Error:", err);
        toast.error("❌ Failed to generate cover letter.", {
          style: { backgroundColor: "#DC2626", color: "white" },
        });
      } finally {
        setLoading(false);
      }
    };

    if (jobId) fetchCoverLetter();
  }, [jobId]);

  const handleSave = async () => {
    if (!coverLetter || !jobId) return;

    setSaving(true);

    const res = await fetch("/api/save-cover-letter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId, content: coverLetter }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Save error:", data?.error || "Unknown error");
      toast.error("❌ Failed to save cover letter.", {
        style: { backgroundColor: "#DC2626", color: "white" },
      });
    } else {
      toast.success("✅ Cover letter saved successfully!", {
        style: { backgroundColor: "#16A34A", color: "white" },
      });
    }

    setSaving(false);
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
      <h1 className="text-3xl font-bold text-primary">
        💌 Cover Letter Generator
      </h1>

      <div className="flex justify-end gap-2 md:gap-4">
        <Button
          onClick={() => setEditing((prev) => !prev)}
          variant="outline"
          className="cursor-pointer"
        >
          {editing ? "Preview" : "Edit"}
        </Button>
        <Button
          onClick={handleSave}
          variant="default"
          disabled={saving}
          className="cursor-pointer"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saving ? "Saving..." : "Save"}
        </Button>
        <Button
          variant="secondary"
          onClick={() => router.push("/dashboard/saved")}
          className="cursor-pointer"
        >
        View Saved Job Details
        </Button>
      </div>

      {editing ? (
        <Textarea
          value={coverLetter}
          onChange={(e) => setCoverLetter(e.target.value)}
          rows={25}
          className="w-full"
        />
      ) : (
        <div
          id="cover-letter-preview"
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
                <ul className="list-disc list-inside space-y-1 mb-4" {...props} />
              ),
              li: ({ ...props }) => (
                <li className="leading-relaxed" {...props} />
              ),
              p: ({ ...props }) => (
                <p className="mb-4 leading-relaxed" {...props} />
              ),
            }}
          >
            {coverLetter}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
}
