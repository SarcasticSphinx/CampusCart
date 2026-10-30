"use client";

import { CircleAlert, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-4 px-6 text-center">
      <CircleAlert aria-hidden="true" className="size-8 text-muted-foreground" />
      <h1 className="text-xl font-semibold">The shop is temporarily unavailable</h1>
      <p className="text-sm text-muted-foreground">We could not load the catalogue. Please try again in a moment.</p>
      <Button variant="outline" onClick={reset}><RotateCcw aria-hidden="true" className="size-4" />Try again</Button>
    </main>
  );
}
