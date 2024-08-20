/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['nifty-tales.s3.amazonaws.com'],
        unoptimized: true,
        remotePatterns: [
            {
              protocol: "https",
              hostname: "**",
            },
        ]
    },
    reactStrictMode: false,
    webpack: (config) => {
        config.externals = [...config.externals, { canvas: "canvas" }];  // required to make Quill work
        return config;
      },
};

export default nextConfig;
