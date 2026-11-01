import type { ReactNode } from "react";

type StepLabelProps = {
  id?: string;
  step: number;
  children: ReactNode;
};

export function StepLabel({ id, step, children }: StepLabelProps) {
  return (
    <h3
      id={id}
      className="mb-3 flex items-center gap-2 text-[11px] font-bold tracking-widest text-muted-foreground uppercase"
    >
      <span className="grid size-5 place-items-center rounded-full bg-primary/15 text-[10px] text-primary">
        {step}
      </span>
      {children}
    </h3>
  );
}
