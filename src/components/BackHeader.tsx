import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";

export const iconLinkClass =
  "grid size-11 shrink-0 place-items-center rounded-xl border border-border bg-card outline-none transition-colors hover:border-primary/60 hover:text-primary focus-visible:ring-[3px] focus-visible:ring-ring/60 active:scale-95";

type BackHeaderProps = {
  /** Shown after "SAAD GYM ·" in the eyebrow, e.g. the level name. */
  eyebrow?: ReactNode;
  /** `null` renders a placeholder while the title is loading. */
  title: ReactNode | null;
  /** Optional control on the right, e.g. a link to another page. */
  action?: ReactNode;
};

/** Header for pages below home: a back button, the brand eyebrow and a title. */
export function BackHeader({ eyebrow, title, action }: BackHeaderProps) {
  return (
    <header className="flex items-center gap-3">
      <Link href="/" aria-label="Back to home" className={iconLinkClass}>
        <ArrowLeft className="size-5" aria-hidden />
      </Link>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-bold tracking-widest text-muted-foreground uppercase">
          SAAD <span className="text-primary">GYM</span>
          {eyebrow && <> · {eyebrow}</>}
        </p>
        {title === null ? (
          <div aria-hidden className="mt-1 h-7 w-24 animate-pulse rounded bg-card" />
        ) : (
          <h1 className="text-2xl leading-tight font-black tracking-tight">{title}</h1>
        )}
      </div>
      {action}
    </header>
  );
}
