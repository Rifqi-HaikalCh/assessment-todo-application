'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { createTodoSchema, type CreateTodoInput } from '@/lib/schemas/todo.schema'
import { useCreateTodo } from '@/lib/hooks/use-todos'

export function AddTodoForm() {
  const createTodoMutation = useCreateTodo()
  
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
    await createTodoMutation.mutateAsync(data)
    reset() // Reset form setelah berhasil
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4">
      <label htmlFor="newtask" className="text-gray-600 font-semibold text-sm">
        Add a new task
      </label>
      <div className="flex space-x-4 items-center">
        <input
          id="newtask"
          {...register('title')}
          className="flex-grow border-b border-[#1e3a8a] text-2xl font-extrabold focus:outline-none"
          placeholder="Enter task..."
        />
        <Button
          type="submit"
          disabled={isSubmitting || createTodoMutation.isPending}
          className="bg-[#0066ff] text-white font-bold px-5 py-2 rounded-md hover:bg-[#0051cc] transition"
        >
          {isSubmitting || createTodoMutation.isPending ? 'Adding...' : 'Add Todo'}
        </Button>
      </div>
      {errors.title && (
        <p className="text-xs text-red-500">{errors.title.message}</p>
      )}
    </form>
  )
}