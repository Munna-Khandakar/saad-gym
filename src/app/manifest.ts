import type { MetadataRoute } from "next";

import { ICON_SIZES } from "@/lib/appIcon";

/*
 * Makes the app installable ("Add to Home Screen"). Besides the app-like feel,
 * an installed web app is exempt from Safari's 7-day deletion of site data, so
 * logged weights survive a break from training.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SAAD GYM — Workout Tracker",
    short_name: "SAAD GYM",
    description: "Train Hard. Stay Consistent. A personal day-by-day gym workout checklist.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#09090B",
    theme_color: "#09090B",
    icons: ICON_SIZES.flatMap((size) => [
      { src: `/icon/${size}`, sizes: `${size}x${size}`, type: "image/png", purpose: "any" as const },
      { src: `/icon/${size}`, sizes: `${size}x${size}`, type: "image/png", purpose: "maskable" as const },
    ]),
  };
}
