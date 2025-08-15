/*
 * Dashboard Layout - main layout buat user yang udah login
 * Dibuat sama Rifqi dengan responsive design yang mantap
 * Include sidebar, header, sama footer yang konsisten
 */
'use client'

import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
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
        "lg:ml-0", // Desktop: no margin needed
        isCollapsed ? "ml-0" : "ml-0" // Mobile: always full width, sidebar is overlay
      )}>
        {/* Header */}
        <Header showSearch />
        
        {/* Page Content */}
        <div className="flex-1 overflow-hidden">
          {children}
        </div>
        
        {/* Footer */}
        <Footer />
      </div>
    </div>
  )
}