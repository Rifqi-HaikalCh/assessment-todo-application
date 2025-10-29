import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  getAdminTodos,
  getAdminUsers,
  toggleAdminTodo,
  deleteAdminTodo,
} from '@/lib/api/admin'
import { AdminFilter } from '@/lib/schemas/admin.schema'

export function useAdminTodos(filter?: AdminFilter) {
  return useQuery({
    queryKey: ['admin-todos', filter],
    queryFn: () => getAdminTodos(filter),
  })
}

export function useAdminUsers() {
  return useQuery({
    queryKey: ['admin-users'],
    queryFn: getAdminUsers,
    staleTime: 5 * 60 * 1000,
  })
}

export function useToggleAdminTodo() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, isDone }: { id: string; isDone: boolean }) =>
      toggleAdminTodo(id, isDone),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-todos'] })
      toast.success('Status todo berhasil diubah')
    },
    onError: (error) => {
      toast.error('Gagal mengubah status todo')
      console.error('Toggle error:', error)
    },
  })
}

export function useDeleteAdminTodo() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => deleteAdminTodo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-todos'] })
      toast.success('Todo berhasil dihapus')
    },
    onError: (error) => {
      toast.error('Gagal menghapus todo')
      console.error('Delete error:', error)
    },
  })
}