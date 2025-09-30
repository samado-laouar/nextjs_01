import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lrscjwgzcqnmqohexgek.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/product_images/**",
      },
    ],
  },
};

export default nextConfig;
