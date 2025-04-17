"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";
import clsx from "clsx";
import Link from "next/link";
import { toast } from "sonner";

type Job = {
  id: string;
  created_at: string;
  skills: string[];
  experience: string[];
  applications: {
    status: string;
    notes: string | null;
  }[];
  resumes?: { id: string }[];
  cover_letters?: { id: string }[];
};

const statusColors: Record<string, string> = {
  saved: "bg-muted text-foreground",
  applied: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  interview:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  offer: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

const statusOptions = [
  "All",
  "Saved",
  "Applied",
  "Interview",
  "Offer",
  "Rejected",
];
const sortOptions = ["Newest", "Oldest"];

export default function SavedJobsPageClient() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filtered, setFiltered] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("All");
  const [sort, setSort] = useState("Newest");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      const res = await fetch("/api/get-saved-jobs");
      const data = await res.json();
      setJobs(data);
      setFiltered(data);
      setLoading(false);
    };
    fetchJobs();
  }, []);

  useEffect(() => {
    let updated = [...jobs];
    if (status !== "All") {
      updated = updated.filter(
        (job) => job.applications?.[0]?.status === status
      );
    }
    updated.sort((a, b) =>
      sort === "Newest"
        ? new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        : new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
    setFiltered(updated);
  }, [status, sort, jobs]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin h-16 w-16 text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-14 space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <h1 className="text-3xl font-bold text-primary">
          📥 Saved Job Details
        </h1>
        <div className="flex gap-4">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <p className="text-muted-foreground text-lg">
        Here&apos;s a result of all your saved job skills & experience based on
        the job descriptions parsed. You can view, edit, or delete them here.
      </p>

      {filtered.length === 0 ? (
        <div className="text-center text-muted-foreground py-20 text-base">
          😕 No saved job details found for <strong>{status}</strong>.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filtered.map((job) => {
            const application = job.applications?.[0];
            const status = application?.status?.toLowerCase();
            const badgeClass = status
              ? statusColors[status] ?? "bg-muted text-foreground"
              : "";

            return (
              <Card
                key={job.id}
                className="rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <CardHeader>
                  <CardTitle className="text-base flex items-center justify-between">
                    🗓 {new Date(job.created_at).toLocaleDateString("en-GB")}
                    {status && (
                      <Badge className={clsx("text-xs capitalize", badgeClass)}>
                        {application.status}
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-2 text-sm">
                  <p className="font-medium">💼 Skills:</p>
                  <ul className="list-disc list-inside">
                    {job.skills?.map((skill, i) => (
                      <li key={i}>{skill}</li>
                    ))}
                  </ul>

                  <p className="font-medium mt-2">📚 Experience:</p>
                  <ul className="list-disc list-inside">
                    {job.experience?.map((exp, i) => (
                      <li key={i}>{exp}</li>
                    ))}
                  </ul>

                  {job.resumes?.length ? (
                    <Link href={`/dashboard/resume-generator?jobId=${job.id}`}>
                      <Button className="mt-2 w-full cursor-pointer" variant="default">
                        View Resume
                      </Button>
                    </Link>
                  ) : (
                    <Link href={`/dashboard/resume-generator?jobId=${job.id}`}>
                      <Button className="mt-2 w-full cursor-pointer" variant="default">
                        Generate Resume
                      </Button>
                    </Link>
                  )}

                  {job.cover_letters?.length ? (
                    <Link
                      href={`/dashboard/cover-letter-generator?jobId=${job.id}`}
                    >
                      <Button className="mt-2 w-full cursor-pointer" variant="outline">
                        View Cover Letter
                      </Button>
                    </Link>
                  ) : (
                    <Link
                      href={`/dashboard/cover-letter-generator?jobId=${job.id}`}
                    >
                      <Button className="mt-2 w-full cursor-pointer" variant="outline">
                        Generate Cover Letter
                      </Button>
                    </Link>
                  )}

                  {application ? (
                    <Link href={`/dashboard/job-applications`}>
                      <Button className="mt-2 w-full cursor-pointer" variant="secondary">
                        View Application
                      </Button>
                    </Link>
                  ) : (
                    <Link
                      href={`/dashboard/job-applications/new?jobId=${job.id}`}
                    >
                      <Button className="mt-2 w-full cursor-pointer" variant="secondary">
                        Track Application
                      </Button>
                    </Link>
                  )}

                  {/* Delete with Dialog */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button className="mt-2 w-full cursor-pointer" variant="destructive">
                        Delete Job Details
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete this job&apos;s details,
                          application, and resume. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={async () => {
                            setIsDeleting(true);
                            const res = await fetch(
                              `/api/delete-saved-job?jobId=${job.id}`,
                              {
                                method: "DELETE",
                              }
                            );

                            if (res.ok) {
                              toast.success(
                                "✅ Job details deleted successfully.",
                                {
                                  style: {
                                    backgroundColor: "#16A34A",
                                    color: "white",
                                  },
                                }
                              );
                              setJobs((prev) =>
                                prev.filter((j) => j.id !== job.id)
                              );
                              setFiltered((prev) =>
                                prev.filter((j) => j.id !== job.id)
                              );
                            } else {
                              toast.error("❌ Failed to delete job.", {
                                style: {
                                  backgroundColor: "#DC2626",
                                  color: "white",
                                },
                              });
                            }

                            setIsDeleting(false);
                          }}
                          disabled={isDeleting}
                          className="bg-red-600 hover:bg-red-700 text-white flex items-center justify-center"
                        >
                          {isDeleting ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : null}
                          {isDeleting ? "Deleting..." : "Yes, delete"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
