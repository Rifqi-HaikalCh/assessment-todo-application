// app/(dashboard)/admin/page.tsx
'use client'

import React from 'react'
import { FilterBar } from '@/components/admin/filter-bar'
import { TodoTable } from '@/components/admin/todo-table'
import { Pagination } from '@/components/admin/pagination'
import { useAdminTodos } from '@/lib/hooks/use-admin-todos'
import { AdminFilter } from '@/lib/schemas/admin.schema'

/**
 * Halaman utama Admin Dashboard
 * Menampilkan semua todos dari semua user dengan fitur filter dan pagination
 */
export default function AdminPage() {
  // State untuk filter dan pagination
  const [filter, setFilter] = React.useState<AdminFilter>({
    page: 1,
    limit: 20,
    status: 'all',
    search: '',
  })
  
  // Fetch todos dengan filter
  const { data, isLoading, error } = useAdminTodos(filter)
  
  /**
   * Handler untuk perubahan halaman
   */
  const handlePageChange = (page: number) => {
    setFilter(prev => ({ ...prev, page }))
    
    // Scroll ke atas saat ganti halaman
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  
  /**
   * Filter todos berdasarkan status lokal
   * Karena API mungkin tidak support filter status
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
    
    // Filter berdasarkan search (jika ada)
    if (filter.search) {
      const searchLower = filter.search.toLowerCase()
      todos = todos.filter(todo => 
        todo.item.toLowerCase().includes(searchLower)
      )
    }
    
    return todos
  }
  
  const filteredTodos = getFilteredTodos()
  const totalPages = Math.ceil(filteredTodos.length / filter.limit) || 1
  
  // Pagination pada hasil yang sudah difilter
  const paginatedTodos = filteredTodos.slice(
    (filter.page - 1) * filter.limit,
    filter.page * filter.limit
  )
  
  return (
    <div className="p-6">
      {/* Page Title */}
      <h1 className="text-2xl font-extrabold text-gray-800 mb-6 select-none">
        To Do
      </h1>
      
      {/* Main Content Card */}
      <section 
        aria-label="To do list section" 
        className="bg-white rounded-xl p-6 shadow-sm"
      >
        {/* Filter Bar */}
        <FilterBar 
          filter={filter} 
          onFilterChange={setFilter} 
        />
        
        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
            <p className="text-sm">Terjadi kesalahan saat memuat data. Silakan coba lagi.</p>
          </div>
        )}
        
        {/* Todo Table */}
        <TodoTable 
          todos={paginatedTodos} 
          isLoading={isLoading} 
        />
        
        {/* Pagination */}
        {!isLoading && !error && (
          <Pagination
            currentPage={filter.page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
        
        {/* Info Total Data */}
        {!isLoading && !error && (
          <div className="mt-4 text-sm text-gray-500 text-center">
            Menampilkan {paginatedTodos.length} dari {filteredTodos.length} todo
            {filter.status !== 'all' && ` (${filter.status})`}
            {filter.search && ` yang cocok dengan "${filter.search}"`}
          </div>
        )}
      </section>
    </div>
  )
}