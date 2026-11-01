import { Dumbbell } from "lucide-react";

export function Header() {
  return (
    <header className="flex items-center gap-3">
      <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-[0_0_32px_-6px] shadow-primary/60">
        <Dumbbell className="size-6" strokeWidth={2.5} aria-hidden />
      </div>
      <div className="min-w-0">
        <h1 className="text-2xl leading-none font-black tracking-tight">
          SAAD <span className="text-primary">GYM</span>
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">Train Hard. Stay Consistent.</p>
      </div>
    </header>
  );
}
