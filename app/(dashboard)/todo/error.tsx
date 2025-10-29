'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function TodoError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-[#dedede] flex items-center justify-center px-6">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-8 text-center">
        <div className="mb-4">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Oops! Terjadi Kesalahan
        </h2>
        
        <p className="text-gray-600 mb-6">
          {error.message || 'Terjadi kesalahan yang tidak terduga. Silakan coba lagi.'}
        </p>

        <div className="flex gap-3 justify-center">
          <Button
            onClick={() => window.location.href = '/'}
            variant="outline"
          >
            Kembali ke Beranda
          </Button>
          <Button onClick={reset}>
            Coba Lagi
          </Button>
        </div>
      </div>
    </div>
  )
}