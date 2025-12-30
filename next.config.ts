/** @type {import('next').NextConfig} */
const nextConfig = {
  // Force Webpack so .glsl works perfectly
  experimental: {
    forceSwcTransforms: false,
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

  output: 'export',
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;