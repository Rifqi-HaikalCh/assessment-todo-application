// src/app/(dashboard)/todo/page.tsx
'use client'

import React from 'react'
import { redirect } from 'next/navigation'
import { useAuthStore } from '@/lib/store/auth.store'
import { TodoList } from '@/components/todo/todo-list'
import { AddTodoForm } from '@/components/todo/add-todo-form'
import { useTodos } from '@/lib/hooks/use-todos'

/**
 * Halaman Todo untuk User Biasa
 * Admin akan diredirect ke halaman admin
 */
export default function TodoPage() {
  const user = useAuthStore(state => state.user)
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  const { data: todosResponse, isLoading, error } = useTodos()
  
  // Check authentication dan role
  React.useEffect(() => {
    if (!isAuthenticated) {
      redirect('/login')
    }
    
    // PERBAIKAN: Redirect admin ke halaman admin
    if (user && user.role === 'admin') {
      redirect('/admin')
    }
  }, [isAuthenticated, user])
  
  // Jika belum ada user data, tampilkan loading
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f8fa]">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }
  
  // Jika admin, jangan render apa-apa (akan redirect)
  if (user.role === 'admin') {
    return null
  }
  
  // Render komponen todo untuk user biasa
  return (
    <div className="p-4 lg:p-6 max-w-4xl mx-auto">
      <h1 className="text-xl lg:text-2xl font-bold text-gray-800 mb-6">
        My To Do List
      </h1>
      
      {/* Form untuk menambah todo baru */}
      <div className="mb-6">
        <AddTodoForm />
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
      
      {/* Daftar todos */}
      {!isLoading && !error && todosResponse?.data && (
        <div className="space-y-4">
          <TodoList todos={todosResponse.data} showSelection={true} />
        </div>
      )}
      
      {/* Empty State */}
      {!isLoading && !error && (!todosResponse?.data || todosResponse.data.length === 0) && (
        <div className="bg-white rounded-lg p-6 lg:p-8 shadow-sm text-center">
          <div className="max-w-md mx-auto">
            <p className="text-gray-600 mb-4">Belum ada todo yang dibuat.</p>
            <p className="text-gray-500 text-sm">Gunakan form di atas untuk menambahkan todo pertama Anda!</p>
          </div>
        </div>
      )}
    </div>
  )
}