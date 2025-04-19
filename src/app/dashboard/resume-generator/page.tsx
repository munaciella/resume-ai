'use client';

import { Suspense } from "react";
import ResumeGeneratorContent from "./content";

export default function ResumeGeneratorPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center h-60">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    }>
      <ResumeGeneratorContent />
    </Suspense>
  );
}
