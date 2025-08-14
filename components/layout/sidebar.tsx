'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, ChevronLeft, Users, LogOut } from 'lucide-react'
import { useLogout, useIsAdmin } from '@/lib/hooks/use-auth'
import { cn } from '@/lib/utils'

export function Sidebar() {
  const pathname = usePathname()
  const isAdmin = useIsAdmin()
  const logout = useLogout()

  const menuItems = [
    {
      label: 'To do',
      href: '/todo',
      icon: Home,
      show: true,
    },
    {
      label: 'Admin',
      href: '/admin',
      icon: Users,
      show: isAdmin,
    },
  ]

  return (
    <aside className="flex flex-col bg-white w-56 border-r border-gray-200 min-h-screen px-6 py-8">
      {/* Logo */}
      <div className="flex items-center space-x-1 mb-8">
        <span className="font-semibold text-gray-700 text-lg select-none">
          Nodewave
        </span>
        <button
          aria-label="Collapse sidebar"
          className="text-gray-400 hover:text-gray-600"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            if (!item.show) return null
            
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors",
                    isActive
                      ? "bg-gray-100 text-gray-700"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Logout Button */}
      <button
        onClick={logout}
        className="flex items-center space-x-2 rounded-lg px-4 py-2 text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors"
      >
        <LogOut className="w-4 h-4" />
        <span>Logout</span>
      </button>
    </aside>
  )
}