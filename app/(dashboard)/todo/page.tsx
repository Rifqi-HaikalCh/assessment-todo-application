'use client'

import { useState, useMemo } from 'react'
import { AddTodoForm } from '@/components/todo/add-todo-form'
import { TodoList } from '@/components/todo/todo-list'
import { useTodos } from '@/lib/hooks/use-todos'
import { useSearchStore } from '@/lib/store/search.store'
import { TodoFilter } from '@/lib/schemas/todo.schema'

export default function TodoPage() {
  const [filter, setFilter] = useState<TodoFilter>({
    status: 'all',
    page: 1,
    limit: 20,
  })

  const { searchQuery } = useSearchStore()
  const { data, isLoading, error } = useTodos(filter)

  // Filter todos berdasarkan search query
  const filteredTodos = useMemo(() => {
    if (!data?.data || !searchQuery.trim()) {
      return data?.data || []
    }
    
    return data.data.filter(todo => 
      todo.title?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [data?.data, searchQuery])

  return (
    <div className="min-h-screen bg-[#dedede] flex flex-col font-inter">
      {/* Top white shape with title - HEADER DIHAPUS KARENA SUDAH ADA DI LAYOUT */}
      <div className="relative bg-white flex justify-center pt-16 pb-20 px-6">
        <div className="absolute top-0 left-0 w-20 h-20 rounded-bl-3xl bg-white" 
          style={{ clipPath: "polygon(0 0, 100% 0, 0 100%)" }}
        />
        <h1 className="text-3xl font-extrabold text-[#1e3a8a] z-10">To Do</h1>
      </div>

      {/* Main Card */}
      <main className="flex justify-center -mt-12 px-6 pb-20">
        <section 
          className="bg-white rounded-xl shadow-lg max-w-3xl w-full p-8"
          style={{ boxShadow: "10px 10px 20px rgba(0,0,0,0.1)" }}
        >
          {/* Add Todo Form */}
          <AddTodoForm />

          {/* Todo List dengan search functionality */}
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Loading todos...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500">Error loading todos</p>
            </div>
          ) : (
            <>
              {searchQuery && (
                <div className="mb-4 text-sm text-gray-600">
                  {filteredTodos.length > 0 
                    ? `Ditemukan ${filteredTodos.length} todo untuk "${searchQuery}"`
                    : `Tidak ada todo yang cocok dengan "${searchQuery}"`
                  }
                </div>
              )}
              <TodoList todos={filteredTodos} showSelection />
            </>
          )}
        </section>
      </main>
    </div>
  )
}