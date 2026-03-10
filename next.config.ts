/** @type {import('next').NextConfig} */
const nextConfig = {
  // Force Webpack so .glsl works perfectly
  experimental: {
    forceSwcTransforms: false,
  },

  typescript: {
    // !! WARN: Temporarily disabled for debugging
    ignoreBuildErrors: false,
  },

  eslint: {
    // Warning: This allows production builds with ESLint errors.
    ignoreDuringBuilds: true,
  },

  webpack: (config: any, { isServer }: { isServer: boolean }) => {
    if (!isServer) {
      config.module.rules.push({
        test: /\.(glsl|vs|fs|vert|frag)$/,
        type: 'asset/source', // Built-in raw loader — no extra deps!
      });
    }
    return config;
  },

  // output: 'export' REMOVED — static export kills ALL API routes (Stripe, HubSpot, Calendly)
  // Deploy to Vercel (Node.js) instead of Hostinger static hosting

  images: {
    unoptimized: true,
    domains: [
      'res.cloudinary.com', // Cloudinary CDN
      'cdn.jsdelivr.net',   // Alternative CDN
      'raw.githubusercontent.com', // GitHub raw files
    ],
    remotePatterns: [
      {
        protocol: 'https' as const,
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
