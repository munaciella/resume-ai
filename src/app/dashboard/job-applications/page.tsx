'use client';

import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx';

type Application = {
  id: string;
  status: 'Saved' | 'Applied' | 'Interview' | 'Offer' | 'Rejected';
  notes: string | null;
  created_at: string;
  parsed_jobs: {
    id: string;
    skills: string[];
    experience: string[];
    created_at: string;
  };
};

const statusColorMap: Record<Application['status'], string> = {
  Saved: 'bg-muted text-foreground',
  Applied: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  Interview: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  Offer: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  Rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

const statusOptions = ['All', 'Saved', 'Applied', 'Interview', 'Offer', 'Rejected'];
const sortOptions = ['Newest', 'Oldest'];

export default function ApplicationsClientPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [filtered, setFiltered] = useState<Application[]>([]);
  const [status, setStatus] = useState<string>('All');
  const [sort, setSort] = useState<string>('Newest');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      const res = await fetch('/api/get-applications');
      const data = await res.json();
      setApplications(data);
      setFiltered(data);
      setLoading(false);
    };

    fetchApplications();
  }, []);

  useEffect(() => {
    let updated = [...applications];
    if (status !== 'All') {
      updated = updated.filter((app) => app.status === status);
    }
    updated.sort((a, b) => {
      return sort === 'Newest'
        ? new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        : new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    });
    setFiltered(updated);
  }, [status, sort, applications]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <h1 className="text-3xl font-bold text-primary">📋 Your Applications</h1>
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

      <p className="text-muted-foreground text-lg">Track your job application progress here.</p>

      {filtered.length === 0 ? (
        <div className="text-center text-muted-foreground py-20 text-base">
          😕 No saved jobs found for <strong>{status}</strong>.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filtered.map((app) => {
            const job = app.parsed_jobs;
            const badgeClass = statusColorMap[app.status];

            return (
              <Card
                key={app.id}
                className="rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <CardHeader>
                  <CardTitle className="flex justify-between items-center text-base">
                    🗓 {new Date(app.created_at).toLocaleDateString('en-GB')}
                    <Badge className={clsx("text-xs capitalize", badgeClass)}>{app.status}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  {job?.skills?.length > 0 && (
                    <>
                      <p className="font-medium">💼 Skills:</p>
                      <ul className="list-disc list-inside">
                        {job.skills.map((skill, i) => (
                          <li key={i}>{skill}</li>
                        ))}
                      </ul>
                    </>
                  )}

                  {job?.experience?.length > 0 && (
                    <>
                      <p className="font-medium mt-2">📚 Experience:</p>
                      <ul className="list-disc list-inside">
                        {job.experience.map((exp, i) => (
                          <li key={i}>{exp}</li>
                        ))}
                      </ul>
                    </>
                  )}

                  {app.notes && (
                    <div className="bg-muted/40 p-3 mt-3 rounded text-muted-foreground whitespace-pre-wrap text-sm">
                      <span className="font-medium block mb-1">📝 Notes:</span>
                      {app.notes}
                    </div>
                  )}

                  <div className="flex flex-col gap-2 mt-4">
                    <Link href={`/dashboard/resume-generator?jobId=${job.id}`}>
                      <Button className="w-full" variant="default">
                        View Resume
                      </Button>
                    </Link>
                    <Link href={`/dashboard/cover-letter-generator?jobId=${job.id}`}>
                      <Button className="w-full" variant="outline">
                        View Cover Letter
                      </Button>
                    </Link>
                    <Link href={`/dashboard/job-applications/new?jobId=${job.id}`}>
                      <Button className="w-full" variant="secondary">
                        Edit Application
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
