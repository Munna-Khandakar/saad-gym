import type { MetadataRoute } from "next";

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
    // Resized from public/logo.jpg. The maskable one is padded so Android's
    // circular crop doesn't clip the barbell plates.
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
