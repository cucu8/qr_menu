import type { NextConfig } from "next";

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5104";
const apiHostname = new URL(apiUrl).hostname;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "localhost", pathname: "/upload/**" },
      { protocol: "http", hostname: "127.0.0.1", pathname: "/upload/**" },
      { protocol: "http", hostname: "api.htreklam.com", pathname: "/upload/**" },
      { protocol: "https", hostname: "api.htreklam.com", pathname: "/upload/**" },
    ],
  },
};

export default nextConfig;
