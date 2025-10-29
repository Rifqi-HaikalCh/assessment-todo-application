'use client'

import { Checkbox } from '@/components/ui/checkbox'
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
      <div className="flex items-center space-x-4">
        {/* Checkbox untuk completed status dengan design baru */}
        <div
          onClick={handleToggle}
          className={cn(
            "w-6 h-6 rounded-sm flex items-center justify-center cursor-pointer transition-colors",
            todo.completed 
              ? "bg-green-200" 
              : "bg-gray-300 hover:bg-gray-400"
          )}
          aria-label={`${todo.completed ? 'Completed' : 'Incomplete'} task checkbox`}
        >
          {todo.completed && (
            <i className="fas fa-check text-green-600 text-sm"></i>
          )}
        </div>
        
        {/* Checkbox untuk selection (jika ada) */}
        {onSelect && (
          <Checkbox
            checked={isSelected}
            onCheckedChange={(checked) => onSelect(todo.id, !!checked)}
            className="ml-2"
          />
        )}
        
        {/* Title dengan design baru */}
        <span className={cn(
          "text-lg select-none",
          todo.completed && "line-through text-gray-500"
        )}>
          {todo.title}
        </span>
      </div>

      {/* Action buttons dengan design baru */}
      <div className="flex items-center space-x-2">
        {todo.completed ? (
          <button
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="text-red-600 text-2xl hover:text-red-700 transition-colors"
            aria-label={`Delete ${todo.title} task`}
          >
            <i className="fas fa-times-circle"></i>
          </button>
        ) : (
          <button
            onClick={handleToggle}
            disabled={toggleMutation.isPending}
            className="text-green-500 text-2xl hover:text-green-600 transition-colors"
            aria-label={`Mark ${todo.title} task as completed`}
          >
            <i className="fas fa-check-circle"></i>
          </button>
        )}
      </div>
    </li>
  )
}