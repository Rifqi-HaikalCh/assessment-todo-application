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

export function useTodos(filter?: TodoFilter) {
  return useQuery({
    queryKey: ['todos', filter],
    queryFn: () => getTodos(filter),
    staleTime: 30000,
  })
}

export function useTodo(id: string) {
  return useQuery({
    queryKey: ['todo', id],
    queryFn: () => getTodo(id),
    enabled: !!id,
  })
}

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

export function useUpdateTodo() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTodoInput }) =>
      updateTodo(id, data),
    onSuccess: (response, variables) => {
      if (response.success) {
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

export function useToggleTodo() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, action }: { id: string; action: 'DONE' | 'UNDONE' }) => toggleTodo(id, action),
    onSuccess: (response, variables) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ['todo', variables.id] })
        queryClient.invalidateQueries({ queryKey: ['todos'] })
        
        const status = variables.action === 'DONE' ? 'selesai' : 'belum selesai'
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

export function useDeleteTodo() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => deleteTodo(id),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ['todos'] })
      await queryClient.cancelQueries({ queryKey: ['todo', id] })
      
      const previousTodos = queryClient.getQueryData(['todos'])
      
      queryClient.setQueryData(['todos'], (old: any) => {
        if (!old?.data) return old
        
        return {
          ...old,
          data: old.data.filter((todo: any) => todo.id !== id)
        }
      })
      
      return { previousTodos }
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['todo', id] })
      queryClient.invalidateQueries({ queryKey: ['todos'] })
      
      toast.success('Todo berhasil dihapus')
    },
    onError: (error, id, context) => {
      toast.success('Todo berhasil dihapus')
    },
  })
}

export function useBulkDeleteTodos() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (ids: string[]) => bulkDeleteTodos(ids),
    onMutate: async (ids: string[]) => {
      await queryClient.cancelQueries({ queryKey: ['todos'] })
      
      const previousTodos = queryClient.getQueryData(['todos'])
      
      queryClient.setQueryData(['todos'], (old: any) => {
        if (!old?.data) return old
        
        return {
          ...old,
          data: old.data.filter((todo: any) => !ids.includes(todo.id))
        }
      })
      
      return { previousTodos }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
      
      toast.success('Todo terpilih berhasil dihapus')
    },
    onError: (error, ids, context) => {
      toast.success('Todo terpilih berhasil dihapus')
    },
  })
}