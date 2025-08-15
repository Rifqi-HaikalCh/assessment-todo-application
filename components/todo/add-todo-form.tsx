// components/todo/add-todo-form.tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
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
    <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-8">
      <div className="flex-grow">
        <label className="block text-gray-600 font-semibold text-sm mb-1 select-none" htmlFor="new-task">
          Add a new task
        </label>
        <input
          id="new-task"
          {...register('title')}
          disabled={isLoading}
          className="w-full border-b border-[#1a3c82] text-xl font-extrabold focus:outline-none bg-transparent"
          type="text"
          placeholder="Enter your task..."
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSubmit(onSubmit)()
            }
          }}
        />
        {errors.title && (
          <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>
        )}
      </div>
      <button
        onClick={handleSubmit(onSubmit)}
        disabled={isLoading}
        className="bg-[#005bff] text-white font-semibold rounded-md px-5 py-2.5 hover:bg-[#0046cc] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Adding...' : 'Add Todo'}
      </button>
    </div>
  )
}