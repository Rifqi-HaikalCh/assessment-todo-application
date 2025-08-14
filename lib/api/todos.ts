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
  const params = new URLSearchParams()
  
  if (filter) {
    if (filter.status && filter.status !== 'all') {
      params.append('status', filter.status)
    }
    if (filter.search) {
      params.append('search', filter.search)
    }
    if (filter.userId) {
      params.append('userId', filter.userId)
    }
    params.append('page', filter.page.toString())
    params.append('limit', filter.limit.toString())
  }
  
  const response = await apiClient.get('/todos', { params })
  
  // Validasi response dengan zod
  return todoListResponseSchema.parse(response.data)
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
  const response = await apiClient.post('/todos', data)
  
  // Validasi response dengan zod
  return todoResponseSchema.parse(response.data)
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
export async function toggleTodo(id: string): Promise<TodoResponse> {
  const response = await apiClient.post(`/todos/${id}/mark`)
  
  // Validasi response dengan zod
  return todoResponseSchema.parse(response.data)
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