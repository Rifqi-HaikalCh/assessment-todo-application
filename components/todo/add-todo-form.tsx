'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { createTodoSchema, type CreateTodoInput } from '@/lib/schemas/todo.schema'
import { createTodo } from '@/lib/api/todos'
import { getErrorMessage } from '@/lib/api/client'

export function AddTodoForm() {
  const queryClient = useQueryClient()
  
  // React Query mutation untuk membuat todo
  const createTodoMutation = useMutation({
    mutationFn: createTodo,
    onSuccess: (response) => {
      if (response.success) {
        // Invalidate dan refetch todos query
        queryClient.invalidateQueries({ queryKey: ['todos'] })
        
        // Reset form
        reset()
        
        // Tampilkan pesan sukses
        toast.success('Todo berhasil ditambahkan!')
      } else {
        toast.error(response.message || 'Gagal menambahkan todo')
      }
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateTodoInput>({
    resolver: zodResolver(createTodoSchema),
    defaultValues: {
      title: '',
    },
  })

  const onSubmit = async (data: CreateTodoInput) => {
    try {
      await createTodoMutation.mutateAsync(data)
    } catch (error) {
      // Error sudah ditangani di onError mutation
      console.error('Error creating todo:', error)
    }
  }

  const isLoading = isSubmitting || createTodoMutation.isPending

  return (
    <div className="bg-white rounded-2xl p-8 shadow-2xl mb-8">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-6">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Add New Todo</h2>
          <p className="text-gray-600">Create a new task to keep track of your progress</p>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <input
              id="newtask"
              {...register('title')}
              disabled={isLoading}
              className="w-full px-4 py-4 text-sm transition-all duration-200 border-2 rounded-xl bg-white focus:outline-none focus:ring-0 border-gray-300 hover:border-gray-400 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Enter your task..."
            />
            {errors.title && (
              <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Adding...' : 'Add Todo'}
          </Button>
        </div>
        
        {/* Error dari mutation */}
        {createTodoMutation.error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p className="text-sm">{getErrorMessage(createTodoMutation.error)}</p>
          </div>
        )}
      </form>
    </div>
  )
}