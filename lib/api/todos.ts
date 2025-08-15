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
  
  // Transform todos to match our schema - HANYA data yang valid dari API
  const transformedTodos = todosArray
    .filter((todo: any) => {
      // HANYA terima todo yang memiliki ID dan title yang valid
      const hasValidId = todo.id || todo._id || todo.uuid
      const hasValidTitle = todo.item || todo.title
      
      // Log warning jika ada data tidak valid (untuk debugging)
      if (!hasValidId || !hasValidTitle) {
        console.warn('⚠️ Skipping invalid todo from API:', {
          todo,
          hasValidId,
          hasValidTitle
        })
      }
      
      return hasValidId && hasValidTitle
    })
    .map((todo: any) => {
      const transformedTodo = {
        // HANYA gunakan ID yang benar-benar ada dari API
        id: todo.id || todo._id || todo.uuid,
        title: todo.item || todo.title,
        completed: todo.isDone || todo.completed || false,
        userId: todo.userId || 'unknown',
        userName: todo.userName || todo.userFullName || undefined,
        createdAt: todo.createdAt || new Date().toISOString(),
        updatedAt: todo.updatedAt || todo.createdAt || new Date().toISOString(),
      }
      
      return transformedTodo
    })
  
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
    
    // Validasi bahwa API mengembalikan ID yang valid
    const apiId = todoData?.id || todoData?._id || todoData?.uuid
    
    if (!apiId) {
      console.error('❌ API tidak mengembalikan ID yang valid:', todoData)
      throw new Error('API Error: Todo berhasil dibuat tapi server tidak mengembalikan ID yang valid. Pastikan API endpoint berfungsi dengan benar.')
    }
    
    // Transform to match our schema - HANYA dengan data valid dari API
    const transformedTodo = {
      id: apiId,  // HANYA gunakan ID dari API, tidak ada fallback
      title: todoData?.item || todoData?.title || data.title,
      completed: todoData?.isDone || todoData?.completed || false,
      userId: todoData?.userId || 'unknown',
      userName: todoData?.userName || todoData?.userFullName || undefined,
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
  // Validasi ID sebelum mengirim request
  if (!id || id === 'undefined' || id.trim() === '') {
    throw new Error('Invalid todo ID: ID cannot be empty or undefined')
  }
  
  try {
    const response = await apiClient.delete(`/todos/${id}`)
    return response.data
  } catch (error: any) {
    // Log error untuk debugging tanpa spam console
    if (error?.response?.status === 404) {
      console.error(`❌ Todo dengan ID '${id}' tidak ditemukan di server. Kemungkinan todo sudah dihapus atau ID tidak valid.`)
      throw new Error(`Todo tidak ditemukan. ID '${id}' mungkin sudah tidak valid.`)
    }
    
    console.error('❌ Delete failed:', error?.response?.data || error.message)
    throw error
  }
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