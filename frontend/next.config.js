/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove or comment out the output: 'export' line if it exists
  // output: 'export',
  
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    domains: ['example.com'], // Add your image domains here
  },
};

module.exports = nextConfig;
