import type { NextConfig } from "next";

function normalizeBlobStoreIdForHost(storeId: string): string {
  return storeId.trim().replace(/^store_/i, "");
}

const blobPublicBaseUrl = (() => {
  const explicit =
    process.env.NEXT_PUBLIC_BLOB_PUBLIC_BASE_URL?.trim() ||
    process.env.BLOB_PUBLIC_BASE_URL?.trim();

  if (explicit) {
    try {
      const parsed = new URL(explicit.replace(/\/$/, ""));
      const [subdomain, ...rest] = parsed.hostname.split(".");

      if (subdomain.startsWith("store_")) {
        parsed.hostname = `${normalizeBlobStoreIdForHost(subdomain)}.${rest.join(".")}`;
      }

      return parsed.origin;
    } catch {
      return explicit.replace(/\/$/, "");
    }
  }

  const storeId = process.env.BLOB_STORE_ID?.trim();

  if (storeId) {
    const hostId = normalizeBlobStoreIdForHost(storeId);
    return `https://${hostId}.public.blob.vercel-storage.com`;
  }

  return undefined;
})();

const nextConfig: NextConfig = {
  ...(blobPublicBaseUrl
    ? {
        env: {
          NEXT_PUBLIC_BLOB_PUBLIC_BASE_URL: blobPublicBaseUrl,
        },
      }
    : {}),
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
