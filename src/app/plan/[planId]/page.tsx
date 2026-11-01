import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PlanView, PlanViewFallback } from "@/components/PlanView";
import { getPlan, isPlanId, WORKOUT_PLANS } from "@/data/workouts";

export function generateStaticParams() {
  return WORKOUT_PLANS.map((plan) => ({ planId: String(plan.id) }));
}

function parsePlanId(value: string) {
  const planId = Number(value);
  return isPlanId(planId) ? planId : null;
}

export async function generateMetadata({ params }: PageProps<"/plan/[planId]">): Promise<Metadata> {
  const planId = parsePlanId((await params).planId);
  return { title: planId ? `${getPlan(planId).name} — SAAD GYM` : "SAAD GYM" };
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
