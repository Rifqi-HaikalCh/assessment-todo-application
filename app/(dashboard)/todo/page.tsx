// app/(dashboard)/todo/page.tsx
'use client'

import React from 'react'
import { redirect } from 'next/navigation'
import { useAuthStore } from '@/lib/store/auth.store'
import { TodoList } from '@/components/todo/todo-list'
import { AddTodoForm } from '@/components/todo/add-todo-form'
import { useTodos } from '@/lib/hooks/use-todos'

/**
 * Halaman Todo untuk User Biasa dengan Design Layout Baru
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
            <div className="text-center py-8 text-gray-500">
              <p>Belum ada todo. Tambahkan todo baru!</p>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}