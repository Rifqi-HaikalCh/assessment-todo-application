// Halaman utama todo buat user biasa - ini main page nya
// Udah include search functionality sama filter yang smooth
'use client'

import React, { useState } from 'react'
import { redirect } from 'next/navigation'
import { useAuthStore } from '@/lib/store/auth.store'
import { useSearchStore } from '@/lib/store/search.store'
import { TodoList } from '@/components/todo/todo-list'
import { AddTodoForm } from '@/components/todo/add-todo-form'
import { useTodos } from '@/lib/hooks/use-todos'
import { Button } from '@/components/ui/button'

type FilterStatus = 'all' | 'completed' | 'pending'

/**
 * Main todo page buat user biasa - design nya udah gua bikin responsive
 * Admin bakal auto redirect ke /admin, jadi aman
 */
export default function TodoPage() {
  // Ambil data user dari auth store
  const user = useAuthStore(state => state.user)
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  const { searchQuery } = useSearchStore() // search dari header
  const { data: todosResponse, isLoading, error } = useTodos()
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')

  // Filter todos berdasarkan search query dan status - real time filtering nih
  const filteredTodos = React.useMemo(() => {
    let todos = todosResponse?.data || []

    // 1. Filter berdasarkan status
    if (filterStatus === 'completed') {
      todos = todos.filter(todo => todo.completed)
    } else if (filterStatus === 'pending') {
      todos = todos.filter(todo => !todo.completed)
    }

    // 2. Filter berdasarkan search query
    if (searchQuery.trim()) {
      todos = todos.filter(todo =>
        todo.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    return todos
  }, [todosResponse?.data, searchQuery, filterStatus])

  // Cek auth sama role - biar user yang bener aja yang bisa masuk
  React.useEffect(() => {
    if (!isAuthenticated) {
      redirect('/login') // belum login? tendang ke login
    }

    // Admin redirect ke dashboard admin - biar gak campur aduk
    if (user && user.role === 'admin') {
      redirect('/admin')
    }
  }, [isAuthenticated, user])

  // Loading state kalo user data belum ada
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f8fa]">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  // Double check - admin gak boleh lihat page ini
  if (user.role === 'admin') {
    return null
  }

  const renderEmptyState = () => {
    if (isLoading || error) return null;

    const hasTodos = (todosResponse?.data || []).length > 0;
    const hasSearchResults = filteredTodos.length > 0;
    const isSearching = searchQuery.trim().length > 0;

    if (!hasTodos && !isSearching) {
      return (
        <div className="text-center py-8 text-gray-500">
          <p>Belum ada todo. Tambahkan todo baru!</p>
        </div>
      );
    }

    if (isSearching && !hasSearchResults) {
      return (
        <div className="text-center py-8 text-gray-500">
          <p>Tidak ada todo yang cocok dengan pencarian "{searchQuery}"</p>
          <p className="text-sm mt-2">Coba gunakan kata kunci yang berbeda</p>
        </div>
      );
    }
    
    if (!isSearching && !hasSearchResults && filterStatus !== 'all') {
       return (
        <div className="text-center py-8 text-gray-500">
          <p>Tidak ada todo dengan status "{filterStatus}"</p>
        </div>
      );
    }

    return null;
  }

  // Render komponen todo dengan design layout baru
  return (
    <div className="min-h-screen bg-gray-50">
      {/* FontAwesome CDN for icons */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
      />

      {/* Main content */}
      <main className="flex-grow flex flex-col items-center pt-10 px-4 sm:px-6 lg:px-8">
        <h1 className="text-[#1a3c82] font-extrabold text-3xl mb-10 select-none">
          To Do
        </h1>

        <section className="bg-white rounded-xl max-w-3xl w-full p-8 shadow-[10px_10px_30px_rgba(0,0,0,0.05)]">
          {/* Form untuk menambah todo baru */}
          <div className="mb-6">
            <AddTodoForm />
          </div>

          {/* Filter Buttons */}
          <div className="flex items-center space-x-2 mb-6">
            {(['all', 'pending', 'completed'] as FilterStatus[]).map(status => (
              <Button
                key={status}
                variant={filterStatus === status ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus(status)}
                className="capitalize"
              >
                {status}
              </Button>
            ))}
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center py-8">
              <div className="text-gray-500">Loading todos...</div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              <p className="text-sm">Terjadi kesalahan saat memuat todos.</p>
            </div>
          )}

          {/* Search Info */}
          {searchQuery.trim() && (
            <div className="mb-4 text-sm text-gray-600">
              {filteredTodos.length > 0
                ? `Menampilkan ${filteredTodos.length} hasil untuk "${searchQuery}"`
                : ''}
            </div>
          )}

          {/* Daftar todos */}
          {!isLoading && !error && filteredTodos.length > 0 && (
            <div className="space-y-4">
              <TodoList todos={filteredTodos} showSelection={true} />
            </div>
          )}

          {/* Empty State */}
          {renderEmptyState()}
        </section>
      </main>
    </div>
  )
}