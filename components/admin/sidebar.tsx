// src/components/admin/sidebar.tsx
'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

/**
 * Komponen Sidebar untuk halaman admin
 * Mengikuti desain HTML template yang diberikan
 */
export function AdminSidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = React.useState(false)
  
  return (
    <aside className="bg-white w-56 flex flex-col border-r border-gray-200">
      {/* Header Sidebar dengan logo/brand - sesuai HTML template */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <span className="font-semibold text-gray-700 select-none">
          Nodewave
        </span>
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label="Collapse sidebar" 
          className="text-gray-400 hover:text-gray-600"
        >
          <i className="fas fa-angle-double-left"></i>
        </button>
      </div>
      
      {/* Menu Navigasi - mengikuti struktur HTML */}
      <nav className="mt-4 px-4">
        <Link
          href="/admin"
          className={cn(
            "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold select-none",
            pathname === '/admin'
              ? "bg-gray-200 text-gray-700"  // Active state sesuai HTML
              : "text-gray-500 hover:bg-gray-50 hover:text-gray-600"
          )}
        >
          <i className="fas fa-home"></i>
          Dashboard
        </Link>
        
        {/* Tambahan menu admin lainnya jika diperlukan */}
        {/* 
        <Link
          href="/admin/users"
          className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold select-none text-gray-500 hover:bg-gray-50 hover:text-gray-600 mt-1"
        >
          <i className="fas fa-users"></i>
          Users
        </Link>
        */}
      </nav>
    </aside>
  )
}