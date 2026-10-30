import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["*.app.github.dev"],
  transpilePackages: ["@component-library/ui", "@component-library/utils"],
};

const withMDX = createMDX({
  options: {
    // Plugins are given by name so the config works with Turbopack.
    rehypePlugins: [
      ["@shikijs/rehype", { themes: { light: "github-light", dark: "github-dark" } }],
    ],
  },
});

export default withMDX(nextConfig);
