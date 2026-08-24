import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  redirects: async () => [
    {
      source: "/portfolio",
      destination: "/cs",
      permanent: true,
    },
  ],
};

export default nextConfig;
