import apiClient from './client'
import {
  Todo,
  CreateTodoInput,
  UpdateTodoInput,
  TodoFilter,
  TodoListResponse,
  TodoResponse,
  BulkAction,
  todoListResponseSchema,
  todoResponseSchema,
} from '@/lib/schemas/todo.schema'

/**
 * API untuk mengambil semua todos
 */
export async function getTodos(filter?: TodoFilter): Promise<TodoListResponse> {
  const response = await apiClient.get('/todos')
  
  // Transform API response to match our schema
  const apiResponse = response.data
  const transformedResponse = {
    success: true,
    message: 'Todos retrieved successfully',
    data: apiResponse || [],
    pagination: {
      total: apiResponse?.length || 0,
      page: 1,
      limit: 20,
      totalPages: 1
    }
  }
  
  return todoListResponseSchema.parse(transformedResponse)
}

/**
 * API untuk mengambil single todo
 */
export async function getTodo(id: string): Promise<TodoResponse> {
  const response = await apiClient.get(`/todos/${id}`)
  
  // Validasi response dengan zod
  return todoResponseSchema.parse(response.data)
}

/**
 * API untuk membuat todo baru
 */
export async function createTodo(data: CreateTodoInput): Promise<TodoResponse> {
  const response = await apiClient.post('/todos', {
    item: data.title
  })
  
  // Transform API response to match our schema
  const apiResponse = response.data
  const transformedResponse = {
    success: true,
    message: 'Todo created successfully',
    data: apiResponse
  }
  
  return todoResponseSchema.parse(transformedResponse)
}

/**
 * API untuk update todo
 */
export async function updateTodo(
  id: string,
  data: UpdateTodoInput
): Promise<TodoResponse> {
  const response = await apiClient.put(`/todos/${id}`, data)
  
  // Validasi response dengan zod
  return todoResponseSchema.parse(response.data)
}

/**
 * API untuk toggle status todo (mark as complete/incomplete)
 */
export async function toggleTodo(id: string, action: 'DONE' | 'UNDONE' = 'DONE'): Promise<TodoResponse> {
  const response = await apiClient.put(`/todos/${id}/mark`, {
    action
  })
  
  // Transform API response to match our schema
  const apiResponse = response.data
  const transformedResponse = {
    success: true,
    message: 'Todo status updated successfully',
    data: apiResponse
  }
  
  return todoResponseSchema.parse(transformedResponse)
}

/**
 * API untuk hapus todo
 */
export async function deleteTodo(id: string): Promise<void> {
  await apiClient.delete(`/todos/${id}`)
}

/**
 * API untuk bulk delete todos
 */
export async function bulkDeleteTodos(ids: string[]): Promise<void> {
  await apiClient.post('/todos/bulk-delete', { ids })
}

/**
 * API untuk bulk action todos
 */
export async function bulkActionTodos(data: BulkAction): Promise<void> {
  await apiClient.post('/todos/bulk-action', data)
}