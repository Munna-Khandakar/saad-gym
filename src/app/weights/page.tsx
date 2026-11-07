import type { Metadata } from "next";

import { WeightsView } from "@/components/WeightsView";

export const metadata: Metadata = { title: "My weights — SAAD GYM" };

export default function WeightsPage() {
  return <WeightsView />;
}
