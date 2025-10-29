import apiClient from './client'
import {
  AdminTodoListResponse,
  AdminFilter,
  adminTodoListResponseSchema,
} from '@/lib/schemas/admin.schema'

export async function getAdminTodos(filter?: AdminFilter): Promise<AdminTodoListResponse> {
  try {
    const params = new URLSearchParams()
    
    if (filter?.page) params.append('page', filter.page.toString())
    if (filter?.limit) params.append('limit', filter.limit.toString())
    if (filter?.search) params.append('search', filter.search)
    if (filter?.userId) params.append('userId', filter.userId)
    
    const response = await apiClient.get(`/todos?${params.toString()}`)
    
    return adminTodoListResponseSchema.parse(response.data)
  } catch (error) {
    console.error('Error fetching admin todos:', error)
    
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

export async function getAdminUsers() {
  try {
    const response = await apiClient.get('/todos')
    const todos = response.data?.content?.entries || []
    
    const usersMap = new Map()
    todos.forEach((todo: any) => {
      if (todo.userId && !usersMap.has(todo.userId)) {
        usersMap.set(todo.userId, {
          id: todo.userId,
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

export async function deleteAdminTodo(id: string) {
  try {
    await apiClient.delete(`/todos/${id}`)
  } catch (error) {
    console.error('Error deleting todo:', error)
    throw error
  }
}