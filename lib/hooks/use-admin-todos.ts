// lib/hooks/use-admin-todos.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  getAdminTodos,
  getAdminUsers,
  toggleAdminTodo,
  deleteAdminTodo,
} from '@/lib/api/admin'
import { AdminFilter } from '@/lib/schemas/admin.schema'

/**
 * Hook untuk mengambil todos sebagai admin
 * Menampilkan todos dari semua user
 */
export function useAdminTodos(filter?: AdminFilter) {
  return useQuery({
    queryKey: ['admin-todos', filter],
    queryFn: () => getAdminTodos(filter),
  })
}

/**
 * Hook untuk mengambil daftar users
 * Digunakan untuk filter dropdown
 */
export function useAdminUsers() {
  return useQuery({
    queryKey: ['admin-users'],
    queryFn: getAdminUsers,
    staleTime: 5 * 60 * 1000, // Cache selama 5 menit
  })
}

/**
 * Hook untuk toggle status todo sebagai admin
 */
export function useToggleAdminTodo() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, isDone }: { id: string; isDone: boolean }) =>
      toggleAdminTodo(id, isDone),
    onSuccess: () => {
      // Invalidate dan refetch todos
      queryClient.invalidateQueries({ queryKey: ['admin-todos'] })
      toast.success('Status todo berhasil diubah')
    },
    onError: (error) => {
      toast.error('Gagal mengubah status todo')
      console.error('Toggle error:', error)
    },
  })
}

/**
 * Hook untuk hapus todo sebagai admin
 */
export function useDeleteAdminTodo() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => deleteAdminTodo(id),
    onSuccess: () => {
      // Invalidate dan refetch todos
      queryClient.invalidateQueries({ queryKey: ['admin-todos'] })
      toast.success('Todo berhasil dihapus')
    },
    onError: (error) => {
      toast.error('Gagal menghapus todo')
      console.error('Delete error:', error)
    },
  })
}