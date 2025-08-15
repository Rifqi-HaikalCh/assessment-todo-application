'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, ChevronLeft, Users, LogOut, Menu } from 'lucide-react'
import { useLogout, useIsAdmin } from '@/lib/hooks/use-auth'
import { useSidebarStore } from '@/lib/store/sidebar.store'
import { cn } from '@/lib/utils'

export function Sidebar() {
  const pathname = usePathname()
  const isAdmin = useIsAdmin()
  const logout = useLogout()
  const { isCollapsed, toggleSidebar, setSidebarCollapsed } = useSidebarStore()

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
    <>
      {/* Mobile overlay */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}
      
      <aside 
        className={cn(
          "flex flex-col bg-white border-r border-gray-200 min-h-screen transition-all duration-300 ease-in-out z-50",
          "fixed lg:relative inset-y-0 left-0",
          isCollapsed 
            ? "-translate-x-full lg:translate-x-0 lg:w-16" 
            : "translate-x-0 w-64 lg:w-56"
        )}
      >
      {/* Header dengan Logo dan Toggle */}
      <div className={cn(
        "flex items-center border-b border-gray-200 py-6",
        isCollapsed ? "justify-center px-4" : "justify-between px-6"
      )}>
        {!isCollapsed && (
          <span className="font-semibold text-gray-700 text-lg select-none">
            Nodewave
          </span>
        )}
        <button
          onClick={toggleSidebar}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md hover:bg-gray-100"
        >
          {isCollapsed ? (
            <Menu className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className={cn("flex-1 mt-6", isCollapsed ? "px-2" : "px-6")}>
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
                    "flex items-center rounded-lg text-sm font-semibold transition-colors relative group",
                    isCollapsed ? "justify-center p-3" : "space-x-2 px-4 py-2",
                    isActive
                      ? "bg-gray-100 text-gray-700"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                  )}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {!isCollapsed && <span>{item.label}</span>}
                  
                  {/* Tooltip untuk mode collapsed */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                      {item.label}
                    </div>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className={cn("border-t border-gray-200 p-4", isCollapsed && "px-2")}>
        <button
          onClick={logout}
          className={cn(
            "flex items-center rounded-lg text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors w-full relative group",
            isCollapsed ? "justify-center p-3" : "space-x-2 px-4 py-2"
          )}
          title={isCollapsed ? "Logout" : undefined}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!isCollapsed && <span>Logout</span>}
          
          {/* Tooltip untuk mode collapsed */}
          {isCollapsed && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
              Logout
            </div>
          )}
        </button>
      </div>
      </aside>
    </>
  )
}