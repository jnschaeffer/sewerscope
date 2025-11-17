import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ydyyisgyiuuqbkekbwpd.supabase.co',
        port: '',
        pathname: '/storage/v1/object/sign/sewerscopeimg/**',
      },
    ],
  },
};

export default nextConfig;
