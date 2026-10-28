import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // The studio lives inside a larger repo; keep Next from treating the repo root as the workspace.
  turbopack: { root: __dirname },
};

export default nextConfig;
