// components/admin/sidebar.tsx
'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, ChevronLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Komponen Sidebar untuk halaman admin
 * Menampilkan navigasi dan branding
 */
export function AdminSidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = React.useState(false)
  
  return (
    <aside 
      className={cn(
        "bg-white border-r border-gray-200 flex flex-col transition-all duration-300",
        isCollapsed ? "w-16" : "w-56"
      )}
    >
      {/* Header Sidebar dengan logo/brand */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
        {!isCollapsed && (
          <span className="font-semibold text-gray-700 text-lg select-none">
            Nodewave
          </span>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <ChevronLeft 
            className={cn(
              "w-5 h-5 transition-transform",
              isCollapsed && "rotate-180"
            )}
          />
        </button>
      </div>
      
      {/* Menu Navigasi */}
      <nav className="mt-6 px-3">
        <Link
          href="/admin"
          className={cn(
            "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors select-none",
            pathname === '/admin'
              ? "bg-gray-100 text-gray-600"
              : "text-gray-500 hover:bg-gray-50 hover:text-gray-600"
          )}
        >
          <Home className="w-4 h-4 text-gray-600" />
          {!isCollapsed && "To do"}
        </Link>
        
        {/* Tambahkan menu lain jika diperlukan */}
        {/* <Link
          href="/admin/users"
          className={cn(
            "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors select-none mt-2",
            pathname === '/admin/users'
              ? "bg-gray-100 text-gray-600"
              : "text-gray-500 hover:bg-gray-50 hover:text-gray-600"
          )}
        >
          <Users className="w-4 h-4 text-gray-600" />
          {!isCollapsed && "Users"}
        </Link> */}
      </nav>
      
      {/* Footer Sidebar (optional) */}
      {!isCollapsed && (
        <div className="mt-auto p-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Admin Panel v1.0
          </p>
        </div>
      )}
    </aside>
  )
}