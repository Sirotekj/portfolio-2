import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
        pathname: "/**",
      },
    ],
  },
  experimental: {
    serverActions: {
      // Výchozí 1 MB nestačí pro upload hlavního obrázku + galerie (originály před sharp).
      bodySizeLimit: "15mb",
    },
  },
  redirects: async () => [
    {
      source: "/portfolio",
      destination: "/cs",
      permanent: true,
    },
  ],
};

export default nextConfig;
