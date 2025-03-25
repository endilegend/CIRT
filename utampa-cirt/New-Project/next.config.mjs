/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // Enable static exports for Netlify static deployment
  distDir: 'out',    // Use 'out' directory for static export
  images: {
    unoptimized: true, // Disable image optimization for static export
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.zotero.org',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.mendeley.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
