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
    reactStrictMode: false
};

export default nextConfig;
