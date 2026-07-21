import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  redirects: async () => [
    {
      source: "/portfolio",
      destination: "/",
      permanent: true,
    },
  ],
};

export default nextConfig;
