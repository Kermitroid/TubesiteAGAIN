/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true
  },
  experimental: {
    forceSwcTransforms: false, // Use Babel instead of SWC
  },
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'vod.api.video',
        port: '',
        pathname: '/my-account/**'
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/my-account/**',
        search: ''
      }
    ]
  },
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

module.exports = nextConfig;
