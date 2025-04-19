'use client';

import { Suspense } from "react";
import NewApplicationPageContent from "./content";

export default function NewApplicationPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center h-60">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    }>
      <NewApplicationPageContent />
    </Suspense>
  );
}
