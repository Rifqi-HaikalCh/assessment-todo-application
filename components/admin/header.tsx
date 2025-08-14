// components/admin/header.tsx
'use client'

import React from 'react'
import { useAuthStore } from '@/lib/store/auth.store'
import { useLogout } from '@/lib/hooks/use-auth'
import { LogOut } from 'lucide-react'

/**
 * Komponen Header untuk halaman admin
 * Menampilkan informasi user dan kontrol logout
 */
export function AdminHeader() {
  const user = useAuthStore(state => state.user)
  const handleLogout = useLogout()
  
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
      {/* Breadcrumb atau Title (optional) */}
      <div className="flex items-center gap-2">
        <h2 className="text-sm font-medium text-gray-600">Admin Dashboard</h2>
      </div>
      
      {/* User Info dan Actions */}
      <div className="flex items-center gap-4">
        {/* User Name */}
        <span className="text-gray-700 text-sm select-none">
          {user?.name || 'Admin'}
        </span>
        
        {/* User Avatar dengan status online */}
        <div className="relative">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-xs font-semibold">
            {user?.name?.charAt(0).toUpperCase() || 'A'}
          </div>
          <span 
            aria-label="Online status" 
            className="absolute bottom-0 right-0 block w-3 h-3 rounded-full ring-2 ring-white bg-green-400"
          />
        </div>
        
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="text-gray-500 hover:text-gray-700 transition-colors"
          title="Logout"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  )
}