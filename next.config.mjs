/** @type {import('next').NextConfig} */
const nextConfig = {
  // Mengaktifkan kompresi gambar untuk mempercepat loading di HP
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Mengizinkan optimasi gambar dari semua sumber link (Supabase, Unsplash, dll)
      },
    ],
  },
};

export default nextConfig;