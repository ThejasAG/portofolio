import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root — a stray package-lock.json in the home
  // directory otherwise makes Next infer the wrong project root.
  turbopack: { root: __dirname },

  // Hide the floating Next.js dev-tools badge. It only ever appeared in
  // `next dev` and was never part of the production build, but it sits on
  // top of the hero and gets in the way when reviewing the design.
  devIndicators: false,
};

export default nextConfig;
