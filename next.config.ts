import type { NextConfig } from "next";

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5104";
const apiHostname = new URL(apiUrl).hostname;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "localhost", pathname: "/uploads/**" },
      { protocol: "http", hostname: "127.0.0.1", pathname: "/uploads/**" },
      { protocol: "http", hostname: "31.57.33.170", pathname: "/uploads/**" },
    ],
  },
};

export default nextConfig;
