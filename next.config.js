// --- Start of next.config (1).js ---
/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'vod.api.video',
        port: '',
        pathname: '/my-account/**'
      }
    ]
  }
};

module.exports = nextConfig;

// --- End of next.config (1).js ---

// --- Start of next.config (2).js ---
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/my-account/**',
        search: ''
      }
    ]
  }
};

// --- End of next.config (2).js ---

// --- Start of next.config.js ---
/**
 * @type {import('next').NextConfig}
 */
module.exports = {
  swcMinify: true,
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/s/:snapshotId',
        destination: '/api/sameorigin/:snapshotId'
      },
      { source: '/r/:snapshotId', destination: '/api/share/:snapshotId' }
    ];
  }
};

// --- End of next.config.js ---
