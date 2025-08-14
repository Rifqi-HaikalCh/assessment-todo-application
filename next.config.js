/** @type {import('next').NextConfig} */
const nextConfig = {
  // Aktifkan strict mode untuk React
  reactStrictMode: true,
  
  // Konfigurasi untuk gambar eksternal jika diperlukan
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: '**.githubusercontent.com',
      },
    ],
  },
  
  // Konfigurasi untuk redirect
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/todo',
        permanent: false,
      },
    ]
  },
  
  // Konfigurasi headers untuk CORS jika diperlukan
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ]
  },
  
  // Environment variables yang bisa diakses di client
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://fe-test-api.nwappservice.com',
  },
}

module.exports = nextConfig