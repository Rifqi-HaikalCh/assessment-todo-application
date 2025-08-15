// src/components/admin/header.tsx
'use client'

import React from 'react'
import { useAuthStore } from '@/lib/store/auth.store'
import { AdminProfile } from './profile'

/**
 * Komponen Header untuk halaman admin
 * Mengikuti desain HTML template yang diberikan
 */
export function AdminHeader() {
  const user = useAuthStore(state => state.user)
  const isLoading = useAuthStore(state => state.isLoading)
  
  return (
    <header className="flex items-center justify-end gap-3 px-6 py-4 border-b border-gray-200 bg-white select-none">
      {/* User Name - hanya tampilkan jika ada data user */}
      <span className="text-sm text-gray-700">
        {isLoading ? (
          <span className="animate-pulse">Loading...</span>
        ) : user?.name ? (
          user.name
        ) : (
          <span className="text-gray-400">No user data</span>
        )}
      </span>
      
      {/* User Avatar dengan status online - sesuai HTML template */}
      <AdminProfile />
    </header>
  )
}