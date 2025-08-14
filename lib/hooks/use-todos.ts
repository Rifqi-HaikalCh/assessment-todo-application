import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  getTodos,
  getTodo,
  createTodo,
  updateTodo,
  toggleTodo,
  deleteTodo,
  bulkDeleteTodos,
} from '@/lib/api/todos'
import {
  CreateTodoInput,
  UpdateTodoInput,
  TodoFilter,
} from '@/lib/schemas/todo.schema'
import { getErrorMessage } from '@/lib/api/client'

/**
 * Hook untuk mengambil list todos
 */
export function useTodos(filter?: TodoFilter) {
  return useQuery({
    queryKey: ['todos', filter],
    queryFn: () => getTodos(filter),
    staleTime: 30000, // 30 detik
  })
}

/**
 * Hook untuk mengambil single todo
 */
export function useTodo(id: string) {
  return useQuery({
    queryKey: ['todo', id],
    queryFn: () => getTodo(id),
    enabled: !!id,
  })
}

/**
 * Hook untuk membuat todo baru
 */
export function useCreateTodo() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: CreateTodoInput) => createTodo(data),
    onSuccess: (response) => {
      if (response.success) {
        // Invalidate dan refetch todos list
        queryClient.invalidateQueries({ queryKey: ['todos'] })
        
        toast.success('Todo berhasil ditambahkan!')
      } else {
        toast.error(response.message || 'Gagal menambahkan todo')
      }
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })
}

/**
 * Hook untuk update todo
 */
export function useUpdateTodo() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTodoInput }) =>
      updateTodo(id, data),
    onSuccess: (response, variables) => {
      if (response.success) {
        // Invalidate specific todo dan todos list
        queryClient.invalidateQueries({ queryKey: ['todo', variables.id] })
        queryClient.invalidateQueries({ queryKey: ['todos'] })
        
        toast.success('Todo berhasil diperbarui!')
      } else {
        toast.error(response.message || 'Gagal memperbarui todo')
      }
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })
}

/**
 * Hook untuk toggle status todo
 */
export function useToggleTodo() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => toggleTodo(id),
    onSuccess: (response, id) => {
      if (response.success) {
        // Invalidate queries
        queryClient.invalidateQueries({ queryKey: ['todo', id] })
        queryClient.invalidateQueries({ queryKey: ['todos'] })
        
        const status = response.data.completed ? 'selesai' : 'belum selesai'
        toast.success(`Todo ditandai ${status}`)
      } else {
        toast.error(response.message || 'Gagal mengubah status todo')
      }
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })
}

/**
 * Hook untuk hapus todo
 */
export function useDeleteTodo() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => deleteTodo(id),
    onSuccess: (_, id) => {
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['todo', id] })
      queryClient.invalidateQueries({ queryKey: ['todos'] })
      
      toast.success('Todo berhasil dihapus')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })
}

/**
 * Hook untuk bulk delete todos
 */
export function useBulkDeleteTodos() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (ids: string[]) => bulkDeleteTodos(ids),
    onSuccess: () => {
      // Invalidate todos list
      queryClient.invalidateQueries({ queryKey: ['todos'] })
      
      toast.success('Todo terpilih berhasil dihapus')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })
}