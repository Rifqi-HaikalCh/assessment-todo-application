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
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4 mb-8">
      <label htmlFor="newtask" className="text-gray-600 font-semibold text-sm">
        Add a new task
      </label>
      <div className="flex space-x-4 items-center">
        <input
          id="newtask"
          {...register('title')}
          disabled={isLoading}
          className="flex-grow border-b border-[#1e3a8a] text-2xl font-extrabold focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder="Enter task..."
        />
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-[#0066ff] text-white font-bold px-5 py-2 rounded-md hover:bg-[#0051cc] transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Adding...' : 'Add Todo'}
        </Button>
      </div>
      {errors.title && (
        <p className="text-xs text-red-500">{errors.title.message}</p>
      )}
      
      {/* Optional: Tampilkan error dari mutation */}
      {createTodoMutation.error && (
        <p className="text-xs text-red-500">
          {getErrorMessage(createTodoMutation.error)}
        </p>
      )}
    </form>
  )
}