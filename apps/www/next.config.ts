import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["*.app.github.dev"],
  transpilePackages: ["@component-library/ui", "@component-library/utils"],
};

const withMDX = createMDX();

export default withMDX(nextConfig);
