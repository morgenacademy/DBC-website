import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/discover",
        destination: "/ontdek",
        permanent: true
      },
      {
        source: "/discover/:slug",
        destination: "/ontdek/:slug",
        permanent: true
      }
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com"
      },
      {
        protocol: "https",
        hostname: "**.cdninstagram.com"
      },
      {
        protocol: "https",
        hostname: "**.supabase.co"
      },
      {
        protocol: "https",
        hostname: "denboschcity.com"
      },
      {
        protocol: "https",
        hostname: "cdn.simpleicons.org"
      }
    ]
  }
};

export default nextConfig;
