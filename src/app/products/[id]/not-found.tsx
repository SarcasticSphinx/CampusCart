import Link from "next/link";
import { ArrowLeft, PackageSearch } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProductNotFound() {
  return <main className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-4 px-6 text-center"><PackageSearch aria-hidden="true" className="size-10 text-muted-foreground" /><h1 className="text-2xl font-medium">We couldn’t find that essential.</h1><p className="text-sm leading-relaxed text-muted-foreground">This product may no longer be available. There are more good things in the collection.</p><Button variant="outline" render={<Link href="/#collection" />}><ArrowLeft aria-hidden="true" className="size-4" />Back to the collection</Button></main>;
}
