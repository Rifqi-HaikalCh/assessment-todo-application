// lib/api/admin.ts
import apiClient from './client'
import {
  AdminTodoListResponse,
  AdminFilter,
  adminTodoListResponseSchema,
} from '@/lib/schemas/admin.schema'

/**
 * API untuk mendapatkan semua todos untuk admin
 * Admin bisa melihat todos dari semua user
 */
export async function getAdminTodos(filter?: AdminFilter): Promise<AdminTodoListResponse> {
  try {
    // Buat query params dari filter
    const params = new URLSearchParams()
    
    if (filter?.page) params.append('page', filter.page.toString())
    if (filter?.limit) params.append('limit', filter.limit.toString())
    if (filter?.search) params.append('search', filter.search)
    if (filter?.userId) params.append('userId', filter.userId)
    
    // Panggil API dengan query params
    const response = await apiClient.get(`/todos?${params.toString()}`)
    
    // Validasi dan return response
    return adminTodoListResponseSchema.parse(response.data)
  } catch (error) {
    console.error('Error fetching admin todos:', error)
    
    // Return data kosong jika error
    return {
      content: {
        entries: [],
        totalData: 0,
        totalPage: 0,
      },
      message: 'Failed to fetch todos',
      errors: ['Failed to fetch todos'],
    }
  }
}

/**
 * API untuk mendapatkan semua users (untuk filter dropdown)
 * Ini akan mengambil unique users dari todos
 */
export async function getAdminUsers() {
  try {
    const response = await apiClient.get('/todos')
    const todos = response.data?.content?.entries || []
    
    // Extract unique users dari todos
    const usersMap = new Map()
    todos.forEach((todo: any) => {
      if (todo.userId && !usersMap.has(todo.userId)) {
        usersMap.set(todo.userId, {
          id: todo.userId,
          // Untuk sementara gunakan ID sebagai nama
          // Idealnya API harus memberikan informasi user
          fullName: `User ${todo.userId.slice(0, 8)}`,
          email: `user${todo.userId.slice(0, 8)}@example.com`,
        })
      }
    })
    
    return Array.from(usersMap.values())
  } catch (error) {
    console.error('Error fetching users:', error)
    return []
  }
}

/**
 * API untuk toggle status todo oleh admin
 */
export async function toggleAdminTodo(id: string, isDone: boolean) {
  try {
    const action = isDone ? 'UNDONE' : 'DONE'
    const response = await apiClient.put(`/todos/${id}/mark`, { action })
    return response.data
  } catch (error) {
    console.error('Error toggling todo:', error)
    throw error
  }
}

/**
 * API untuk hapus todo oleh admin
 */
export async function deleteAdminTodo(id: string) {
  try {
    await apiClient.delete(`/todos/${id}`)
  } catch (error) {
    console.error('Error deleting todo:', error)
    throw error
  }
}