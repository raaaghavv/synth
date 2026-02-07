/** @type {import('next').NextConfig} */

// Parse API URL for image remote patterns
const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const apiUrlObj = new URL(apiUrl);

const nextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    // Use unoptimized for local development (Next.js blocks localhost/private IPs)
    unoptimized: process.env.NODE_ENV === "development",
    remotePatterns: [
      {
        protocol: apiUrlObj.protocol.replace(":", ""),
        hostname: apiUrlObj.hostname,
        port: apiUrlObj.port || "",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
