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

export async function getTodos(filter?: TodoFilter): Promise<TodoListResponse> {
  const response = await apiClient.get('/todos')
  
  const apiResponse = response.data
  
  let todosArray = []
  if (apiResponse.content?.entries) {
    todosArray = apiResponse.content.entries
  } else if (Array.isArray(apiResponse.data)) {
    todosArray = apiResponse.data
  } else if (Array.isArray(apiResponse)) {
    todosArray = apiResponse
  }
  
  const transformedTodos = todosArray
    .filter((todo: any) => {
      const hasValidId = todo.id || todo._id || todo.uuid
      const hasValidTitle = todo.item || todo.title
      
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

export async function getTodo(id: string): Promise<TodoResponse> {
  const response = await apiClient.get(`/todos/${id}`)
  
  return todoResponseSchema.parse(response.data)
}

export async function createTodo(data: CreateTodoInput): Promise<TodoResponse> {
  try {
    const response = await apiClient.post('/todos', {
      item: data.title
    })
    
    const apiResponse = response.data
    
    let todoData
    if (apiResponse?.content) {
      todoData = apiResponse.content
    } else if (apiResponse?.data) {
      todoData = apiResponse.data
    } else if (apiResponse) {
      todoData = apiResponse 
    } else {
      todoData = {}
    }
    
    const apiId = todoData?.id || todoData?._id || todoData?.uuid
    
    if (!apiId) {
      console.error('❌ API gak return ID yang valid:', todoData)
      throw new Error('API Error: Todo berhasil dibuat tapi server gak return ID yang valid')
    }
    
    const transformedTodo = {
      id: apiId,
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

export async function updateTodo(
  id: string,
  data: UpdateTodoInput
): Promise<TodoResponse> {
  const response = await apiClient.put(`/todos/${id}`, data)
  
  return todoResponseSchema.parse(response.data)
}

export async function toggleTodo(id: string, action: 'DONE' | 'UNDONE' = 'DONE'): Promise<TodoResponse> {
  const response = await apiClient.put(`/todos/${id}/mark`, {
    action
  })
  
  const apiResponse = response.data
  
  let todoData
  if (apiResponse.content) {
    todoData = apiResponse.content
  } else if (apiResponse.data) {
    todoData = apiResponse.data
  } else {
    todoData = apiResponse
  }
  
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

export async function deleteTodo(id: string): Promise<void> {
  if (!id || id === 'undefined' || id.trim() === '') {
    throw new Error('Invalid todo ID: ID cannot be empty or undefined')
  }
  
  try {
    const response = await apiClient.delete(`/todos/${id}`)
    return response.data
  } catch (error: any) {
    if (error?.response?.status === 404) {
      console.error(`❌ Todo dengan ID '${id}' tidak ditemukan di server. Kemungkinan todo sudah dihapus atau ID tidak valid.`)
      throw new Error(`Todo tidak ditemukan. ID '${id}' mungkin sudah tidak valid.`)
    }
    
    console.error('❌ Delete failed:', error?.response?.data || error.message)
    throw error
  }
}

export async function bulkDeleteTodos(ids: string[]): Promise<void> {
  await Promise.all(ids.map(id => deleteTodo(id)))
}

export async function bulkActionTodos(data: BulkAction): Promise<void> {
  await apiClient.post('/todos/bulk-action', data)
}