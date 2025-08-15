// src/app/(dashboard)/admin/page.tsx
'use client'

import React from 'react'
import { useAdminTodos } from '@/lib/hooks/use-admin-todos'
import { AdminFilter } from '@/lib/schemas/admin.schema'

/**
 * Halaman utama Admin Dashboard
 * Redesigned sesuai dengan HTML template yang diberikan
 */
export default function AdminPage() {
  // State untuk filter dan pagination
  const [filter, setFilter] = React.useState<AdminFilter>({
    page: 1,
    limit: 20,
    status: 'all',
    search: '',
  })
  
  const [searchValue, setSearchValue] = React.useState('')
  
  // Fetch todos dengan filter
  const { data, isLoading, error } = useAdminTodos(filter)
  
  /**
   * Handler untuk submit search
   */
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setFilter(prev => ({ ...prev, search: searchValue, page: 1 }))
  }
  
  /**
   * Handler untuk perubahan filter status
   */
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(prev => ({
      ...prev,
      status: e.target.value as 'all' | 'success' | 'pending',
      page: 1
    }))
  }
  
  /**
   * Handler untuk perubahan halaman
   */
  const handlePageChange = (page: number) => {
    setFilter(prev => ({ ...prev, page }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  
  /**
   * Filter todos berdasarkan status lokal
   */
  const getFilteredTodos = () => {
    if (!data?.content?.entries) return []
    
    let todos = [...data.content.entries]
    
    // Filter berdasarkan status
    if (filter.status === 'success') {
      todos = todos.filter(todo => todo.isDone === true)
    } else if (filter.status === 'pending') {
      todos = todos.filter(todo => todo.isDone === false)
    }
    
    // Filter berdasarkan search
    if (filter.search) {
      const searchLower = filter.search.toLowerCase()
      todos = todos.filter(todo => 
        todo.item.toLowerCase().includes(searchLower) ||
        (todo.user?.fullName && todo.user.fullName.toLowerCase().includes(searchLower))
      )
    }
    
    return todos
  }
  
  /**
   * Format nama user dari data
   */
  const formatUserName = (todo: any) => {
    if (todo.user?.fullName) {
      return todo.user.fullName
    }
    if (todo.user?.name) {
      return todo.user.name
    }
    if (todo.userName) {
      return todo.userName
    }
    return 'Unknown User' // Fallback jika tidak ada data user
  }
  
  const filteredTodos = getFilteredTodos()
  const totalPages = Math.ceil(filteredTodos.length / filter.limit) || 1
  
  // Pagination pada hasil yang sudah difilter
  const paginatedTodos = filteredTodos.slice(
    (filter.page - 1) * filter.limit,
    filter.page * filter.limit
  )
  
  return (
    <>
      {/* Page title - sesuai HTML template */}
      <section className="px-8 py-6 bg-[#f7f8fa] border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800 select-none">
          To Do
        </h1>
      </section>
      
      {/* Content - sesuai HTML template */}
      <section className="flex-1 px-8 py-6">
        <div className="bg-white rounded-lg p-6 shadow-sm max-w-full overflow-x-auto">
          {/* Toolbar - sesuai HTML template */}
          <form onSubmit={handleSearch} className="flex items-center gap-4 mb-6 flex-wrap">
            <label className="sr-only" htmlFor="search">
              Search
            </label>
            <div className="relative flex-1 min-w-[180px] max-w-xs">
              <input 
                className="w-full border border-gray-200 rounded-md py-2 pl-9 pr-3 text-sm text-gray-400 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600" 
                id="search"
                placeholder="Search" 
                type="search"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
              <i aria-hidden="true" className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none"></i>
            </div>
            <button 
              className="bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600" 
              type="submit"
            >
              Search
            </button>
            <div className="ml-auto flex items-center gap-1 text-sm text-gray-700 cursor-pointer select-none">
              <select
                value={filter.status}
                onChange={handleStatusChange}
                className="bg-transparent border-none cursor-pointer focus:outline-none"
              >
                <option value="all">Filter by Status</option>
                <option value="success">Success</option>
                <option value="pending">Pending</option>
              </select>
              <i className="fas fa-chevron-down text-xs"></i>
            </div>
          </form>
          
          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
              <p className="text-sm">Terjadi kesalahan saat memuat data.</p>
            </div>
          )}
          
          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center py-8">
              <div className="text-gray-500">Loading todos...</div>
            </div>
          )}
          
          {/* Table - sesuai HTML template */}
          {!isLoading && !error && (
            <>
              <table className="w-full text-left text-gray-700 text-sm border-collapse">
                <thead className="bg-[#fafafa] border-b border-gray-200">
                  <tr>
                    <th className="font-semibold py-3 px-4">Name</th>
                    <th className="font-semibold py-3 px-4">To do</th>
                    <th className="font-semibold py-3 px-4">Statue</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedTodos.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="py-8 text-center text-gray-500">
                        Tidak ada data todo
                      </td>
                    </tr>
                  ) : (
                    paginatedTodos.map((todo) => (
                      <tr key={todo.id} className="border-b border-gray-200">
                        <td className="py-3 px-4">
                          {formatUserName(todo)}
                        </td>
                        <td className="py-3 px-4">
                          {todo.item}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-block text-white text-xs font-semibold rounded-full px-3 py-1 select-none ${
                            todo.isDone 
                              ? 'bg-green-400'   // Success - sesuai HTML template
                              : 'bg-red-500'     // Pending - sesuai HTML template
                          }`}>
                            {todo.isDone ? 'Success' : 'Pending'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              
              {/* Pagination - sesuai HTML template */}
              {totalPages > 1 && (
                <nav aria-label="Pagination" className="mt-6 flex justify-end items-center gap-2 text-gray-600 text-sm select-none">
                  <button 
                    onClick={() => handlePageChange(filter.page - 1)}
                    disabled={filter.page === 1}
                    aria-label="Previous page" 
                    className="p-1 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded disabled:text-gray-300 disabled:cursor-not-allowed"
                  >
                    <i className="fas fa-chevron-left"></i>
                  </button>
                  
                  {/* Page numbers */}
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    const pageNum = i + 1
                    const isActive = pageNum === filter.page
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        aria-current={isActive ? "page" : undefined}
                        className={`w-8 h-8 rounded border focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                          isActive
                            ? 'border-blue-600 bg-blue-600 text-white'
                            : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  })}
                  
                  <button 
                    onClick={() => handlePageChange(filter.page + 1)}
                    disabled={filter.page >= totalPages}
                    aria-label="Next page" 
                    className="p-1 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded disabled:text-gray-300 disabled:cursor-not-allowed"
                  >
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </nav>
              )}
              
              {/* Info Total Data */}
              <div className="mt-4 text-sm text-gray-500 text-center">
                Menampilkan {paginatedTodos.length} dari {filteredTodos.length} todo
                {filter.status !== 'all' && ` (${filter.status})`}
                {filter.search && ` yang cocok dengan "${filter.search}"`}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  )
}