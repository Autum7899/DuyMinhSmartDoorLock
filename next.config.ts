import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'pub-1ad0b58a12834136a469dfd3b6644387.r2.dev',
                port: '',
                pathname: '/**',
            },
        ],
    },
  /* config options here */
};

export default nextConfig;
