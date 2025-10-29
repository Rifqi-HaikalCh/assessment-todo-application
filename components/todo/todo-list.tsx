'use client'

import { useState } from 'react'
import { TodoItem } from './todo-item'
import { Todo } from '@/lib/schemas/todo.schema'
import { useBulkDeleteTodos } from '@/lib/hooks/use-todos'
import { toast } from 'sonner'

interface TodoListProps {
  todos: Todo[]
  showSelection?: boolean
}

export function TodoList({ todos, showSelection = false }: TodoListProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const bulkDeleteMutation = useBulkDeleteTodos()

  const handleSelect = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedIds)
    if (checked) {
      newSelected.add(id)
    } else {
      newSelected.delete(id)
    }
    setSelectedIds(newSelected)
  }

  const handleBulkDelete = () => {
    if (selectedIds.size === 0) {
      toast.error('Pilih minimal 1 todo untuk dihapus')
      return
    }

    if (confirm(`Apakah Anda yakin ingin menghapus ${selectedIds.size} todo?`)) {
      bulkDeleteMutation.mutate(Array.from(selectedIds))
      setSelectedIds(new Set())
    }
  }

  if (todos.length === 0) {
    return null
  }

  return (
    <>
      {/* Todo List dengan design layout baru */}
      <ul className="divide-y divide-gray-300">
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onSelect={showSelection ? handleSelect : undefined}
            isSelected={selectedIds.has(todo.id)}
          />
        ))}
      </ul>

      {/* Button Delete Selected dengan design baru */}
      {showSelection && selectedIds.size > 0 && (
        <button
          onClick={handleBulkDelete}
          disabled={bulkDeleteMutation.isPending}
          className="mt-8 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-md px-5 py-2.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          type="button"
        >
          {bulkDeleteMutation.isPending 
            ? 'Deleting...' 
            : selectedIds.size > 0 
              ? `Delete Selected (${selectedIds.size})` 
              : 'Delete Selected'}
        </button>
      )}
    </>
  )
}