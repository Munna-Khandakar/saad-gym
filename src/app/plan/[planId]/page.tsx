import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PlanView, PlanViewFallback } from "@/components/PlanView";
import { getLevel, getPlan, isPlanId, WORKOUT_PLANS } from "@/data/workouts";

export function generateStaticParams() {
  return WORKOUT_PLANS.map((plan) => ({ planId: plan.id }));
}

function parsePlanId(value: string) {
  return isPlanId(value) ? value : null;
}

export async function generateMetadata({ params }: PageProps<"/plan/[planId]">): Promise<Metadata> {
  const planId = parsePlanId((await params).planId);
  if (!planId) return { title: "SAAD GYM" };
  const plan = getPlan(planId);
  return { title: `${getLevel(plan.level).name} · ${plan.name} — SAAD GYM` };
}

// Reading `params` happens inside <Suspense> so navigations can show the
// skeleton immediately instead of blocking on URL data.
export default function PlanPage({ params }: PageProps<"/plan/[planId]">) {
  return (
    <Suspense fallback={<PlanViewFallback />}>
      <PlanContent params={params} />
    </Suspense>
  );
}

async function PlanContent({ params }: Pick<PageProps<"/plan/[planId]">, "params">) {
  const planId = parsePlanId((await params).planId);
  if (!planId) notFound();
  return <PlanView planId={planId} />;
}
