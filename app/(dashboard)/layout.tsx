'use client'

import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { useSidebarStore } from '@/lib/store/sidebar.store'
import { cn } from '@/lib/utils'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isCollapsed } = useSidebarStore()
  
  return (
    <div className="flex min-h-screen bg-[#f7f8fa]">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className={cn(
        "flex-1 flex flex-col transition-all duration-300 ease-in-out",
        isCollapsed ? "ml-0" : "ml-0" // Let sidebar handle its own width
      )}>
        {/* Header */}
        <Header showSearch />
        
        {/* Page Content */}
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  )
}