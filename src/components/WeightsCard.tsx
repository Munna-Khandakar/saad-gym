import Link from "next/link";
import { ChevronRight, Weight } from "lucide-react";

/** Home-page link to the "My weights" summary. */
export function WeightsCard() {
  return (
    <Link
      href="/weights"
      prefetch
      className="group flex min-h-20 items-center gap-4 rounded-2xl border border-border bg-card px-5 py-4 outline-none transition-all duration-200 hover:border-primary/60 hover:bg-primary/[0.06] focus-visible:ring-[3px] focus-visible:ring-ring/60 active:scale-[0.98]"
    >
      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
        <Weight className="size-5" aria-hidden />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-lg leading-tight font-black tracking-tight">My weights</span>
        <span className="block text-sm text-muted-foreground">
          Your last weight for every exercise
        </span>
      </span>
      <ChevronRight
        className="size-5 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-primary"
        aria-hidden
      />
    </Link>
  );
}
