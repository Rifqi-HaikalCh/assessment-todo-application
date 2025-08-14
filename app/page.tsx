'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store/auth.store'

export default function HomePage() {
  const router = useRouter()
  const { isAuthenticated, checkAuth } = useAuthStore()

  useEffect(() => {
    // Cek apakah user sudah login
    if (checkAuth()) {
      // Jika sudah login, redirect ke halaman todo
      router.push('/todo')
    } else {
      // Jika belum login, redirect ke halaman login
      router.push('/login')
    }
  }, [router, checkAuth])

  // Tampilkan loading screen sementara
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  )
}