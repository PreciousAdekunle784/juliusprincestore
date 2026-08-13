/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Add your Supabase Storage host and any product-image CDN here.
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' },
      { protocol: 'https', hostname: 'placehold.co' }, // dev placeholders only
    ],
  },
};
export default nextConfig;
