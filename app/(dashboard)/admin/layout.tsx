// src/app/(dashboard)/admin/layout.tsx
'use client'

import React from 'react'
import { redirect } from 'next/navigation'
import { useAuthStore } from '../../../lib/store/auth.store'
import { AdminSidebar } from '../../../components/admin/sidebar'
import { AdminHeader } from '../../../components/admin/header'

/**
 * Layout untuk halaman admin
 * Mengikuti struktur HTML template yang diberikan
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = useAuthStore(state => state.user)
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  
  // Check authentication dan role
  React.useEffect(() => {
    if (!isAuthenticated) {
      redirect('/login')
    }
    
    // Cek apakah user adalah admin
    if (user && user.role !== 'admin') {
      // Jika bukan admin, redirect ke halaman todo user biasa
      redirect('/todo')
    }
  }, [isAuthenticated, user])
  
  // Jika belum ada user data, tampilkan loading
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f8fa]">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }
  
  // Jika bukan admin, jangan render apa-apa (akan redirect)
  if (user.role !== 'admin') {
    return null
  }
  
  return (
    <div className="bg-[#f7f8fa] text-[#4b5563] min-h-screen">
      <div className="flex min-h-screen">
        {/* Sidebar - sesuai HTML template */}
        <AdminSidebar />
        
        {/* Main content - sesuai HTML template */}
        <main className="flex-1 flex flex-col">
          {/* Header - sesuai HTML template */}
          <AdminHeader />
          
          {/* Page Content */}
          {children}
        </main>
      </div>
    </div>
  )
}