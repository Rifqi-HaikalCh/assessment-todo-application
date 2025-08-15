'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState, useEffect } from 'react'
import { useAuthStore } from '@/lib/store/auth.store'

function AuthProvider({ children }: { children: React.ReactNode }) {
  const syncTokenToCookie = useAuthStore((state) => state.syncTokenToCookie)
  
  useEffect(() => {
    // Sync token to cookie on app initialization
    syncTokenToCookie()
  }, [syncTokenToCookie])
  
  return <>{children}</>
}

export function Providers({ children }: { children: React.ReactNode }) {
  // Membuat QueryClient instance dengan konfigurasi default
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Konfigurasi default untuk semua query
            staleTime: 60 * 1000, // 1 menit
            gcTime: 5 * 60 * 1000, // 5 menit (sebelumnya cacheTime)
            retry: 1,
            refetchOnWindowFocus: false,
          },
          mutations: {
            // Konfigurasi default untuk semua mutation
            retry: 1,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {children}
      </AuthProvider>
      {/* React Query Devtools hanya muncul di development */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  )
}