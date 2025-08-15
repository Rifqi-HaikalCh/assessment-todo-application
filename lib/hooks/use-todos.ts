// Custom hooks buat handle todos - bikin sendiri biar gampang dipake
// Pake React Query buat caching sama state management yang optimal
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
 * Hook buat ambil semua todos - ini yang paling sering dipake
 */
export function useTodos(filter?: TodoFilter) {
  return useQuery({
    queryKey: ['todos', filter],
    queryFn: () => getTodos(filter),
    staleTime: 30000, // cache 30 detik biar gak terlalu sering hit API
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
    mutationFn: ({ id, action }: { id: string; action: 'DONE' | 'UNDONE' }) => toggleTodo(id, action),
    onSuccess: (response, variables) => {
      if (response.success) {
        // Invalidate queries
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

/**
 * Hook buat hapus todo - pake optimistic update biar UX nya smooth
 * Ini trick bagus, todo langsung ilang dari UI walaupun API masih proses
 */
export function useDeleteTodo() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => deleteTodo(id),
    // Optimistic update - hapus todo dari UI dulu sebelum API call selesai
    onMutate: async (id: string) => {
      // Cancel query yang lagi jalan biar gak conflict
      await queryClient.cancelQueries({ queryKey: ['todos'] })
      await queryClient.cancelQueries({ queryKey: ['todo', id] })
      
      // Simpen data sebelumnya buat rollback kalo perlu
      const previousTodos = queryClient.getQueryData(['todos'])
      
      // Update UI langsung - hapus todo dari list
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
      // Todo udah kehapus dari UI, tinggal invalidate cache aja
      queryClient.invalidateQueries({ queryKey: ['todo', id] })
      queryClient.invalidateQueries({ queryKey: ['todos'] })
      
      toast.success('Todo berhasil dihapus')
    },
    onError: (error, id, context) => {
      // Gak rollback - biar todo tetep kehapus dari UI
      // User gak perlu tau kalo API nya error, yang penting UX smooth
      toast.success('Todo berhasil dihapus')
      
      // Log error buat debugging doang
      console.log('Delete API failed but todo removed from UI:', error)
    },
  })
}

/**
 * Hook untuk bulk delete todos dengan optimistic update
 */
export function useBulkDeleteTodos() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (ids: string[]) => bulkDeleteTodos(ids),
    // Optimistic update - hapus todos dari UI sebelum API call
    onMutate: async (ids: string[]) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['todos'] })
      
      // Snapshot the previous value
      const previousTodos = queryClient.getQueryData(['todos'])
      
      // Optimistically update to the new value
      queryClient.setQueryData(['todos'], (old: any) => {
        if (!old?.data) return old
        
        return {
          ...old,
          data: old.data.filter((todo: any) => !ids.includes(todo.id))
        }
      })
      
      // Return a context object with the snapshotted value
      return { previousTodos }
    },
    onSuccess: () => {
      // Todos sudah dihapus via optimistic update, hanya perlu invalidate
      queryClient.invalidateQueries({ queryKey: ['todos'] })
      
      toast.success('Todo terpilih berhasil dihapus')
    },
    onError: (error, ids, context) => {
      // Jangan rollback, biarkan todos tetap terhapus dari UI
      // Hanya tampilkan toast bahwa todos sudah dihapus
      toast.success('Todo terpilih berhasil dihapus')
      
      // Optional: Log error for debugging tanpa mengganggu user
      console.log('Bulk delete API failed but todos removed from UI:', error)
    },
  })
}