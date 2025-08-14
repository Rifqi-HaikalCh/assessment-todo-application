'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { AddTodoForm } from '@/components/todo/add-todo-form'
import { TodoList } from '@/components/todo/todo-list'
import { useTodos } from '@/lib/hooks/use-todos'
import { TodoFilter } from '@/lib/schemas/todo.schema'

export default function TodoPage() {
  const [filter, setFilter] = useState<TodoFilter>({
    status: 'all',
    page: 1,
    limit: 20,
  })

  const { data, isLoading, error } = useTodos(filter)

  return (
    <div className="min-h-screen bg-[#dedede] flex flex-col font-inter">
      {/* Header */}
      <Header />

      {/* Top white shape with title */}
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

          {/* Todo List */}
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Loading todos...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500">Error loading todos</p>
            </div>
          ) : (
            <TodoList todos={data?.data || []} showSelection />
          )}
        </section>
      </main>
    </div>
  )
}