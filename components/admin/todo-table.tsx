// components/admin/todo-table.tsx
'use client'

import React from 'react'
import { Trash2, CheckCircle, Circle } from 'lucide-react'
import { AdminTodo } from '@/lib/schemas/admin.schema'
import { useToggleAdminTodo, useDeleteAdminTodo } from '@/lib/hooks/use-admin-todos'
import { cn } from '@/lib/utils'

interface TodoTableProps {
  todos: AdminTodo[]
  isLoading?: boolean
}

export function TodoTable({ todos, isLoading }: TodoTableProps) {
  const toggleMutation = useToggleAdminTodo()
  const deleteMutation = useDeleteAdminTodo()

  const handleToggle = (id: string, currentStatus: boolean) => {
    toggleMutation.mutate({ id, isDone: currentStatus })
  }

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus todo ini?')) {
      deleteMutation.mutate(id)
    }
  }

  const formatUserName = (todo: AdminTodo) => {
    if (todo.user?.fullName) {
      return todo.user.fullName
    }
    return `User ${todo.userId.slice(0, 8)}`
  }
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-gray-500">Loading todos...</div>
      </div>
    )
  }
  
  if (!todos || todos.length === 0) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-gray-500">Tidak ada data todo</div>
      </div>
    )
  }
  
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-gray-700 text-sm border-separate border-spacing-y-1">
        <thead className="bg-gray-100 text-gray-700 font-semibold select-none">
          <tr>
            <th className="py-3 px-4 rounded-l-lg">Name</th>
            <th className="py-3 px-4">To do</th>
            <th className="py-3 px-4">Status</th>
            <th className="py-3 px-4 rounded-r-lg text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {todos.map((todo) => (
            <tr key={todo.id} className="border-b border-gray-200">
              <td className="py-3 px-4">
                {formatUserName(todo)}
              </td>
              <td className="py-3 px-4">
                <span className={cn(
                  todo.isDone && "line-through text-gray-400"
                )}>
                  {todo.item}
                </span>
              </td>
              <td className="py-3 px-4">
                <span
                  className={cn(
                    "inline-block text-white text-xs font-semibold rounded-full px-3 py-1 select-none",
                    todo.isDone
                      ? "bg-green-400"
                      : "bg-red-500"
                  )}
                >
                  {todo.isDone ? 'Success' : 'Pending'}
                </span>
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center justify-center gap-2">
                  {/* Toggle Status Button */}
                  <button
                    onClick={() => handleToggle(todo.id, todo.isDone)}
                    className={cn(
                      "p-1 rounded hover:bg-gray-100 transition-colors",
                      toggleMutation.isPending && "opacity-50 cursor-not-allowed"
                    )}
                    disabled={toggleMutation.isPending}
                    title={todo.isDone ? "Mark as pending" : "Mark as done"}
                  >
                    {todo.isDone ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <Circle className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                  
                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(todo.id)}
                    className={cn(
                      "p-1 rounded hover:bg-gray-100 transition-colors",
                      deleteMutation.isPending && "opacity-50 cursor-not-allowed"
                    )}
                    disabled={deleteMutation.isPending}
                    title="Delete todo"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}