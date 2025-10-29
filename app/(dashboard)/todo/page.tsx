'use client'

import React, { useState } from 'react'
import { redirect } from 'next/navigation'
import { useAuthStore } from '@/lib/store/auth.store'
import { useSearchStore } from '@/lib/store/search.store'
import { TodoList } from '@/components/todo/todo-list'
import { AddTodoForm } from '@/components/todo/add-todo-form'
import { RefreshCw } from 'lucide-react'
import { useTodos } from '@/lib/hooks/use-todos'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

type FilterStatus = 'all' | 'completed' | 'pending'

export default function TodoPage() {
  const user = useAuthStore(state => state.user)
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  const { searchQuery } = useSearchStore()
  const { data: todosResponse, isLoading, error, refetch } = useTodos()
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')
  const [isSpinning, setIsSpinning] = useState(false)

  const handleRefresh = () => {
    setIsSpinning(true)
    refetch()

    setTimeout(() => {
      setIsSpinning(false)
      toast.success('Data berhasil diperbarui')
    }, 2000)
  }

  const filteredTodos = React.useMemo(() => {
    let todos = todosResponse?.data || []

    if (filterStatus === 'completed') {
      todos = todos.filter(todo => todo.completed)
    } else if (filterStatus === 'pending') {
      todos = todos.filter(todo => !todo.completed)
    }

    if (searchQuery.trim()) {
      todos = todos.filter(todo =>
        todo.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    return todos
  }, [todosResponse?.data, searchQuery, filterStatus])

  React.useEffect(() => {
    if (!isAuthenticated) {
      redirect('/login')
    }

    if (user && user.role === 'admin') {
      redirect('/admin')
    }
  }, [isAuthenticated, user])

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f8fa]">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

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

          {/* Filter and Refresh Buttons */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
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
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isSpinning}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isSpinning ? 'animate-spin' : ''}`} />
              {isSpinning ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow animate-pulse">
                  <div className="h-6 w-6 bg-gray-200 rounded-md"></div>
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
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