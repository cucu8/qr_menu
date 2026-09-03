import type { NextConfig } from "next";
import path from "path";

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5104";
const apiHostname = new URL(apiUrl).hostname;

const nextConfig: NextConfig = {
  // QR/ altında kardeş projelerin (qr_dashboard, qr_landing) her birinin kendi
  // package-lock.json'ı olduğu için Next, workspace root'unu yanlışlıkla QR/'a
  // çıkarıyor ve node_modules'i orada arıyordu. Root'u burada sabitliyoruz.
  outputFileTracingRoot: path.join(__dirname),
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "localhost", pathname: "/upload/**" },
      { protocol: "http", hostname: "127.0.0.1", pathname: "/upload/**" },
      { protocol: "http", hostname: "api.htreklam.com", pathname: "/upload/**" },
      { protocol: "https", hostname: "api.htreklam.com", pathname: "/upload/**" },
      { protocol: "https", hostname: "pub-5855d22c0745468cb30a8d50949dd704.r2.dev", pathname: "/menu/**" },
    ],
  },
};

export default nextConfig;
