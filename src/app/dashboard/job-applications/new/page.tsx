'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectItem, SelectContent } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { toast } from "sonner";

const statuses = ["Saved", "Applied", "Interview", "Offer", "Rejected"];

export default function NewApplicationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const jobId = searchParams.get('jobId');

  const [status, setStatus] = useState('Saved');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (!jobId) {
      toast.warning("⚠️ Please select a job before tracking an application.", {
        style: {
          backgroundColor: "#FACC15",
          color: "black",
        },
      });
  
      setRedirecting(true);
      const timer = setTimeout(() => {
        router.push("/dashboard/saved");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [jobId, router]);  

  const handleSubmit = async () => {
    if (!jobId) return;
    setSubmitting(true);
  
    const res = await fetch("/api/save-application", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId, status, notes }),
    });
  
    if (!res.ok) {
      toast.error("❌ Failed to save application.", {
        style: {
          backgroundColor: "#DC2626",
          color: "white",
        },
      });
    } else {
      toast.success("✅ Application saved successfully!", {
        style: {
          backgroundColor: "#16A34A",
          color: "white",
        },
      });
      router.push("/dashboard/job-applications");
    }
  
    setSubmitting(false);
  };  

  if (redirecting) {
    return (
      <div className="max-w-xl mx-auto text-center py-24 space-y-4">
        <Loader2 className="h-16 w-16 text-primary animate-spin mx-auto" />
        <p className="text-lg font-medium">Please select a job from your Saved Job Details before creating a new or track an application.</p>
        <p className="text-muted-foreground text-sm">Redirecting you now...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-14 space-y-6">
      <h1 className="text-3xl font-bold text-primary">🎯 Add New or Edit Job Application To Track</h1>
      <p className="text-muted-foreground">Save the status and notes for this job.</p>

      <div className="space-y-4">
        <div>
          <Label>Status</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-full mt-1">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {statuses.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Notes (optional)</Label>
          <Textarea
            rows={6}
            placeholder="Add notes about the job, company name, interview progress, etc."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="mt-1 resize-none"
          />
        </div>

        <Button onClick={handleSubmit} disabled={submitting} className='cursor-pointer'>
          {submitting ? "Saving..." : "Save Application"}
        </Button>
      </div>
    </div>
  );
}
