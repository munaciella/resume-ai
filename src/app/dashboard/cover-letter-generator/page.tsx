'use client';

import { Suspense } from "react";
import CoverLetterGeneratorPageContent from "./content";

export default function CoverLetterGeneratorPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center h-60">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    }>
      <CoverLetterGeneratorPageContent />
    </Suspense>
  );
}
