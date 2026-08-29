import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mutaah-api.apps.taqat.academy",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;