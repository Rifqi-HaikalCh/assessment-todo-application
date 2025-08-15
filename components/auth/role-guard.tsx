'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCurrentUser } from '../../lib/hooks/use-auth'

interface RoleGuardProps {
  children: React.ReactNode
  allowedRoles: ('user' | 'admin')[]
  redirectTo?: string
  fallback?: React.ReactNode
}

/**
 * Component untuk mengontrol akses berdasarkan role
 * Akan redirect pengguna jika role tidak sesuai
 */
export function RoleGuard({ 
  children, 
  allowedRoles, 
  redirectTo,
  fallback 
}: RoleGuardProps) {
  const user = useCurrentUser()
  const router = useRouter()

  useEffect(() => {
    if (user && !allowedRoles.includes(user.role)) {
      // Redirect berdasarkan role
      if (user.role === 'admin' && redirectTo) {
        router.replace(redirectTo)
      } else if (user.role === 'admin') {
        router.replace('/admin')
      } else {
        router.replace('/todo')
      }
    }
  }, [user, allowedRoles, redirectTo, router])

  // Jika user belum load
  if (!user) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  // Jika role tidak diizinkan
  if (!allowedRoles.includes(user.role)) {
    return fallback || null
  }

  // Jika role sesuai, tampilkan children
  return <>{children}</>
}