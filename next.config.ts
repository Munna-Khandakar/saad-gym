import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // Plans used to have numeric ids; keep old bookmarks and home-screen links working.
  // Temporary, so browsers don't cache them if plans are reorganised again.
  async redirects() {
    return [
      { source: "/plan/1", destination: "/plan/beginner-1", permanent: false },
      { source: "/plan/2", destination: "/plan/beginner-2", permanent: false },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
