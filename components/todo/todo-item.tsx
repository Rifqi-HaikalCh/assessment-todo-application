'use client'

import { Check, X, CheckCircle } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Todo } from '@/lib/schemas/todo.schema'
import { useToggleTodo, useDeleteTodo } from '@/lib/hooks/use-todos'
import { cn } from '@/lib/utils'

interface TodoItemProps {
  todo: Todo
  onSelect?: (id: string, checked: boolean) => void
  isSelected?: boolean
}

export function TodoItem({ todo, onSelect, isSelected }: TodoItemProps) {
  const toggleMutation = useToggleTodo()
  const deleteMutation = useDeleteTodo()

  const handleToggle = () => {
    const action = todo.completed ? 'UNDONE' : 'DONE'
    toggleMutation.mutate({ id: todo.id, action })
  }

  const handleDelete = () => {
    if (confirm('Apakah Anda yakin ingin menghapus todo ini?')) {
      deleteMutation.mutate(todo.id)
    }
  }

  return (
    <li className="flex items-center justify-between py-4">
      <div className="flex items-center space-x-3">
        {/* Checkbox untuk completed status */}
        <div
          onClick={handleToggle}
          className={cn(
            "w-6 h-6 rounded-sm flex items-center justify-center cursor-pointer transition-colors",
            todo.completed 
              ? "bg-green-200 text-green-600" 
              : "bg-gray-300 hover:bg-gray-400"
          )}
        >
          {todo.completed && <Check className="w-4 h-4" />}
        </div>
        
        {/* Checkbox untuk selection (jika ada) */}
        {onSelect && (
          <Checkbox
            checked={isSelected}
            onCheckedChange={(checked) => onSelect(todo.id, !!checked)}
            className="ml-2"
          />
        )}
        
        {/* Title */}
        <span className={cn(
          "text-lg",
          todo.completed && "line-through text-gray-500"
        )}>
          {todo.title}
        </span>
      </div>

      {/* Action buttons */}
      <div className="flex items-center space-x-2">
        {!todo.completed ? (
          <button
            onClick={handleToggle}
            disabled={toggleMutation.isPending}
            className="text-green-500 text-2xl hover:text-green-600 transition"
            aria-label="Mark as completed"
          >
            <CheckCircle className="w-6 h-6" />
          </button>
        ) : (
          <button
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="text-red-600 text-2xl hover:text-red-700 transition"
            aria-label="Delete todo"
          >
            <X className="w-6 h-6" />
          </button>
        )}
      </div>
    </li>
  )
}