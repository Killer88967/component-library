import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["*.app.github.dev"],
  transpilePackages: ["@component-library/ui", "@component-library/utils"],
};

export default nextConfig;
