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
  
  // Handle different API response structures
  let todosArray = []
  if (apiResponse.content?.entries) {
    todosArray = apiResponse.content.entries
  } else if (Array.isArray(apiResponse.data)) {
    todosArray = apiResponse.data
  } else if (Array.isArray(apiResponse)) {
    todosArray = apiResponse
  }
  
  // Transform todos to match our schema
  const transformedTodos = todosArray.map((todo: any) => ({
    id: todo.id || todo._id || Math.random().toString(36).substr(2, 9),
    title: todo.item || todo.title || 'Todo Item',
    completed: todo.isDone || todo.completed || false,
    userId: todo.userId || 'current-user',
    userName: todo.userName || todo.userFullName || 'Current User',
    createdAt: todo.createdAt || new Date().toISOString(),
    updatedAt: todo.updatedAt || new Date().toISOString(),
  }))
  
  const transformedResponse = {
    success: true,
    message: apiResponse.message || 'Todos retrieved successfully',
    data: transformedTodos,
    pagination: {
      total: transformedTodos.length,
      page: 1,
      limit: 20,
      totalPages: Math.ceil(transformedTodos.length / 20)
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
  try {
    const response = await apiClient.post('/todos', {
      item: data.title
    })
    
    // Transform API response to match our schema
    const apiResponse = response.data
    
    // The API might return different structures, let's handle them
    let todoData
    if (apiResponse?.content) {
      // If API returns { content: { ... } }
      todoData = apiResponse.content
    } else if (apiResponse?.data) {
      // If API returns { data: { ... } }
      todoData = apiResponse.data
    } else if (apiResponse) {
      // If API returns the todo object directly
      todoData = apiResponse
    } else {
      // Fallback if response is empty
      todoData = {}
    }
    
    // Transform to match our schema
    const transformedTodo = {
      id: todoData?.id || todoData?._id || Math.random().toString(36).substr(2, 9),
      title: todoData?.item || todoData?.title || data.title,
      completed: todoData?.isDone || todoData?.completed || false,
      userId: todoData?.userId || 'current-user',
      userName: todoData?.userName || todoData?.userFullName || 'Current User',
      createdAt: todoData?.createdAt || new Date().toISOString(),
      updatedAt: todoData?.updatedAt || new Date().toISOString(),
    }
    
    const transformedResponse = {
      success: true,
      message: apiResponse?.message || 'Todo created successfully',
      data: transformedTodo
    }
    
    return todoResponseSchema.parse(transformedResponse)
  } catch (error) {
    console.error('Error creating todo:', error)
    throw error
  }
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
  
  // The API might return different structures, let's handle them
  let todoData
  if (apiResponse.content) {
    // If API returns { content: { ... } }
    todoData = apiResponse.content
  } else if (apiResponse.data) {
    // If API returns { data: { ... } }
    todoData = apiResponse.data
  } else {
    // If API returns the todo object directly
    todoData = apiResponse
  }
  
  // Transform to match our schema
  const transformedTodo = {
    id: todoData.id || todoData._id || id,
    title: todoData.item || todoData.title || 'Todo Item',
    completed: todoData.isDone || todoData.completed || (action === 'DONE'),
    userId: todoData.userId || 'current-user',
    userName: todoData.userName || todoData.userFullName || 'Current User',
    createdAt: todoData.createdAt || new Date().toISOString(),
    updatedAt: todoData.updatedAt || new Date().toISOString(),
  }
  
  const transformedResponse = {
    success: true,
    message: apiResponse.message || 'Todo status updated successfully',
    data: transformedTodo
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