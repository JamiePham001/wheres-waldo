/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [new URL("http://res.cloudinary.com/**")],
  },
};

export default nextConfig;
