

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "192.168.100.19",
        port: "1337",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
