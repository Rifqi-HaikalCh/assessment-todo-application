// src/app/(dashboard)/todo/page.tsx
'use client'

import React from 'react'
import { redirect } from 'next/navigation'
import { useAuthStore } from '@/lib/store/auth.store'
// Import komponen todo yang sudah ada
// import { TodoList } from '@/components/todo/todo-list'
// import { AddTodoForm } from '@/components/todo/add-todo-form'

/**
 * Halaman Todo untuk User Biasa
 * Admin akan diredirect ke halaman admin
 */
export default function TodoPage() {
  const user = useAuthStore(state => state.user)
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  
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
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        My To Do List
      </h1>
      
      {/* Komponen todo yang sudah ada */}
      {/* <AddTodoForm />
      <TodoList /> */}
      
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <p className="text-gray-600">
          Halaman ini khusus untuk user biasa. Admin akan diredirect ke halaman admin.
        </p>
      </div>
    </div>
  )
}