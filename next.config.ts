import type { NextConfig } from "next";

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5104";
const apiHostname = new URL(apiUrl).hostname;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: apiHostname,
        port: "",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
