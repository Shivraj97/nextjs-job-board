/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "niypi7gnumpwp4cl.public.blob.vercel-storage.com",
      },
    ],
  },
};

module.exports = nextConfig;
