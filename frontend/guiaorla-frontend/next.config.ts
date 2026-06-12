const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5148',
        pathname: '/uploads/**',
      },
    ],
  },
};
export default nextConfig;