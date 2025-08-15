'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Home, ChevronLeft, Search, ChevronDown, ChevronRight, User, LogOut } from 'lucide-react'
import { useAuthStore } from '@/lib/store/auth.store'
import { useLogout } from '@/lib/hooks/use-auth'
import { useAdminTodos } from '@/lib/hooks/use-admin-todos'
import { AdminFilter } from '@/lib/schemas/admin.schema'
import { RoleGuard } from '@/components/auth/role-guard'
import { cn } from '@/lib/utils'

/**
 * Admin Dashboard - halaman khusus buat admin aja
 * Design nya gua bikin sendiri dengan table responsive yang keren
 * Include search, filter, pagination yang smooth banget
 * Credit: @RifqiHaikal-2025
 */
export default function AdminPage() {
  const user = useAuthStore(state => state.user)
  const logout = useLogout()
  const router = useRouter()
  
  // State untuk sidebar dan filter
  const [isCollapsed, setIsCollapsed] = React.useState(false)
  const [filter, setFilter] = React.useState<AdminFilter>({
    page: 1,
    limit: 10, // Sesuaikan dengan template
    status: 'all',
    search: '',
  })
  const [searchValue, setSearchValue] = React.useState('')
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = React.useState(false)

  // Fetch data todos
  const { data, isLoading, error } = useAdminTodos(filter)
  
  // Filter dan pagination logic
  const getFilteredTodos = () => {
    if (!data?.content?.entries) return []
    
    let todos = [...data.content.entries]
    
    if (filter.status === 'success') {
      todos = todos.filter(todo => todo.isDone === true)
    } else if (filter.status === 'pending') {
      todos = todos.filter(todo => todo.isDone === false)
    }
    
    if (filter.search) {
      const searchLower = filter.search.toLowerCase()
      todos = todos.filter(todo => {
        const todoText = todo.item.toLowerCase()
        const userName = formatUserName(todo).toLowerCase()
        const status = todo.isDone ? 'success' : 'pending'
        
        return todoText.includes(searchLower) || 
               userName.includes(searchLower) || 
               status.includes(searchLower)
      })
    }
    
    return todos
  }

  // Event handlers
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setFilter(prev => ({
      ...prev,
      search: searchValue,
      page: 1,
    }))
  }

  const handleStatusFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(prev => ({
      ...prev,
      status: e.target.value as 'all' | 'success' | 'pending',
      page: 1,
    }))
  }

  const handlePageChange = (page: number) => {
    setFilter(prev => ({ ...prev, page }))
  }

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const handleProfileClick = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen)
  }

  const handleViewProfile = () => {
    setIsProfileDropdownOpen(false)
    router.push('/profile')
  }

  const handleLogoutClick = () => {
    setIsProfileDropdownOpen(false)
    handleLogout()
  }

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('.profile-dropdown')) {
        setIsProfileDropdownOpen(false)
      }
    }

    if (isProfileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isProfileDropdownOpen])
  
  const filteredTodos = getFilteredTodos()
  const totalPages = Math.ceil(filteredTodos.length / filter.limit) || 1
  const paginatedTodos = filteredTodos.slice(
    (filter.page - 1) * filter.limit,
    filter.page * filter.limit
  )

  const formatUserName = (todo: any) => {
    if (todo.user?.fullName) return todo.user.fullName
    return 'Unknown User' // Default sesuai template
  }

  return (
    <RoleGuard allowedRoles={['admin']} redirectTo="/todo">
      <div className="bg-[#f7f8fa] text-[#4b5563] min-h-screen">
        <div className="flex min-h-screen">
          {/* Mobile menu overlay */}
          {!isCollapsed && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={() => setIsCollapsed(true)}
            />
          )}
          
          {/* Sidebar */}
          <aside className={cn(
            "bg-white flex flex-col border-r border-gray-200 transition-all duration-300 z-50",
            "fixed lg:relative inset-y-0 left-0",
            isCollapsed 
              ? "-translate-x-full lg:translate-x-0 lg:w-16" 
              : "translate-x-0 w-64 lg:w-56"
          )}>
            <div className="flex items-center justify-between px-4 lg:px-6 py-4 border-b border-gray-200">
              {!isCollapsed && (
                <span className="font-semibold text-gray-700 select-none text-lg lg:text-base">
                  Nodewave
                </span>
              )}
              <button 
                onClick={() => setIsCollapsed(!isCollapsed)}
                aria-label="Toggle sidebar" 
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <ChevronLeft className={cn(
                  "w-5 h-5 transition-transform",
                  isCollapsed && "rotate-180"
                )} />
              </button>
            </div>
            <nav className="mt-4 px-4">
              <Link 
                href="/admin"
                className="flex items-center gap-2 rounded-lg bg-gray-200 text-gray-700 px-4 py-2 text-sm font-semibold select-none"
              >
                <Home className="w-4 h-4" />
                {!isCollapsed && "Dashboard"}
              </Link>
            </nav>
          </aside>

          {/* Main Content */}
          <main className={cn(
            "flex-1 flex flex-col transition-all duration-300",
            "lg:ml-0", // Desktop: no margin needed
            isCollapsed ? "ml-0" : "ml-0" // Mobile: always full width
          )}>
            {/* Mobile Header with Menu Button */}
            <header className="flex items-center justify-between lg:justify-end gap-3 px-4 lg:px-6 py-4 border-b border-gray-200 bg-white select-none">
              {/* Mobile menu button */}
              <button 
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="lg:hidden text-gray-500 hover:text-gray-700 p-2"
                aria-label="Toggle menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              {/* User info with dropdown */}
              <div className="relative profile-dropdown">
                <button 
                  onClick={handleProfileClick}
                  className="flex items-center gap-3 hover:bg-gray-50 rounded-lg p-2 transition-colors"
                >
                  <span className="text-sm text-gray-700 hidden sm:block">
                    {user?.name || 'User'}
                  </span>
                  <div className="relative w-8 h-8 rounded-full overflow-hidden border border-gray-300">
                    <div className="w-full h-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-xs font-semibold">
                      {user?.name?.charAt(0).toUpperCase() || 'A'}
                    </div>
                    <span 
                      aria-label="Online status" 
                      className="absolute bottom-0 right-0 block w-3 h-3 rounded-full border-2 border-white bg-green-500"
                    />
                  </div>
                  <ChevronDown className={cn(
                    "w-4 h-4 text-gray-400 transition-transform hidden sm:block",
                    isProfileDropdownOpen && "rotate-180"
                  )} />
                </button>

                {/* Dropdown Menu */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <button
                      onClick={handleViewProfile}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      Lihat Profile
                    </button>
                    <hr className="my-1 border-gray-200" />
                    <button
                      onClick={handleLogoutClick}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </header>

            {/* Page Title */}
            <section className="px-4 lg:px-8 py-4 lg:py-6 bg-[#f7f8fa] border-b border-gray-200">
              <h1 className="text-xl lg:text-2xl font-bold text-gray-800 select-none">
                To Do
              </h1>
            </section>

            {/* Content */}
            <section className="flex-1 px-4 lg:px-8 py-4 lg:py-6">
              <div className="bg-white rounded-lg p-4 lg:p-6 shadow-sm">
                {/* Search and Filter - Responsive */}
                <form onSubmit={handleSearch} className="space-y-4 lg:space-y-0 lg:flex lg:items-center lg:gap-3 mb-6">
                  <label className="sr-only" htmlFor="search">Search</label>
                  
                  {/* Search Input */}
                  <div className="relative flex-1 lg:max-w-md">
                    <input 
                      className="w-full border border-gray-300 rounded-lg py-2.5 pl-10 pr-4 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" 
                      id="search"
                      placeholder="Search by name, todo, or status..." 
                      type="search"
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                  </div>

                  {/* Buttons Container */}
                  <div className="flex flex-row gap-2 lg:gap-3">
                    <button 
                      className="bg-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-all shadow-sm" 
                      type="submit"
                    >
                      Search
                    </button>
                    
                    {/* Filter Dropdown */}
                    <div className="relative">
                      <select
                        value={filter.status}
                        onChange={handleStatusFilter}
                        className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer transition-all shadow-sm"
                      >
                        <option value="all">All Status</option>
                        <option value="success">Success</option>
                        <option value="pending">Pending</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </form>

                {/* Table Container with Horizontal Scroll */}
                <div className="overflow-x-auto bg-white rounded-lg border border-gray-200 shadow-sm">
                  <table className="w-full text-left text-gray-700 text-sm min-w-[500px]">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                      <tr>
                        <th className="font-semibold py-4 px-4 lg:px-6 text-xs lg:text-sm text-gray-800 tracking-wide uppercase">Name</th>
                        <th className="font-semibold py-4 px-4 lg:px-6 text-xs lg:text-sm text-gray-800 tracking-wide uppercase">To do</th>
                        <th className="font-semibold py-4 px-4 lg:px-6 text-xs lg:text-sm text-center text-gray-800 tracking-wide uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {isLoading ? (
                        <tr className="bg-gray-50/50">
                          <td colSpan={3} className="py-12 text-center text-gray-500">
                            <div className="flex items-center justify-center space-x-2">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                              <span>Loading...</span>
                            </div>
                          </td>
                        </tr>
                      ) : paginatedTodos.length === 0 ? (
                        <tr className="bg-gray-50/50">
                          <td colSpan={3} className="py-12 text-center text-gray-500">
                            <div className="flex flex-col items-center space-y-2">
                              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              <span>Tidak ada data</span>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        paginatedTodos.map((todo, index) => (
                          <tr 
                            key={todo.id} 
                            className={cn(
                              "transition-all duration-200 ease-in-out",
                              "hover:bg-blue-50/70 hover:shadow-sm hover:scale-[1.001]",
                              "group cursor-pointer",
                              index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                            )}
                          >
                            <td className="py-4 px-4 lg:px-6">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-semibold shadow-sm">
                                  {formatUserName(todo).charAt(0).toUpperCase()}
                                </div>
                                <div className="font-medium text-gray-900 group-hover:text-blue-800 transition-colors truncate max-w-[120px] lg:max-w-none">
                                  {formatUserName(todo)}
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4 lg:px-6">
                              <div className="text-gray-700 group-hover:text-gray-900 transition-colors break-words max-w-[200px] lg:max-w-none leading-relaxed">
                                {todo.item}
                              </div>
                            </td>
                            <td className="py-4 px-4 lg:px-6 text-center">
                              <span className={cn(
                                "inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium transition-all shadow-sm",
                                todo.isDone 
                                  ? "bg-emerald-100 text-emerald-800 border border-emerald-200 group-hover:bg-emerald-200" 
                                  : "bg-amber-100 text-amber-800 border border-amber-200 group-hover:bg-amber-200"
                              )}>
                                <div className={cn(
                                  "w-1.5 h-1.5 rounded-full mr-1.5",
                                  todo.isDone ? "bg-emerald-500" : "bg-amber-500"
                                )}></div>
                                {todo.isDone ? 'Success' : 'Pending'}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination - Responsive */}
                {!isLoading && paginatedTodos.length > 0 && (
                  <nav aria-label="Pagination" className="mt-6 flex flex-col sm:flex-row sm:justify-between items-center gap-4">
                    {/* Results info */}
                    <div className="text-sm text-gray-500 order-2 sm:order-1">
                      Showing {paginatedTodos.length} of {filteredTodos.length} results
                    </div>
                    
                    {/* Pagination buttons */}
                    <div className="flex items-center gap-1 lg:gap-2 order-1 sm:order-2">
                      <button 
                        onClick={() => handlePageChange(filter.page - 1)}
                        disabled={filter.page === 1}
                        aria-label="Previous page" 
                        className="p-2 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      
                      {/* Show fewer page numbers on mobile */}
                      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else {
                          // Show current page and surrounding pages
                          const start = Math.max(1, filter.page - 2);
                          pageNum = start + i;
                          if (pageNum > totalPages) return null;
                        }
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            aria-current={pageNum === filter.page ? "page" : undefined}
                            className={cn(
                              "w-8 h-8 lg:w-10 lg:h-10 text-xs lg:text-sm rounded border focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors",
                              pageNum === filter.page
                                ? "border-blue-600 bg-blue-600 text-white"
                                : "border-gray-300 bg-white text-gray-600 hover:bg-gray-100"
                            )}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      
                      <button 
                        onClick={() => handlePageChange(filter.page + 1)}
                        disabled={filter.page === totalPages}
                        aria-label="Next page" 
                        className="p-2 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </nav>
                )}
              </div>
            </section>
          </main>
          
        </div>
      </div>
    </RoleGuard>
  )
}