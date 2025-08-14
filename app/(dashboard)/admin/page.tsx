'use client'

import { useState } from 'react'
import { Search, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useTodos } from '@/lib/hooks/use-todos'
import { TodoFilter } from '@/lib/schemas/todo.schema'
import { formatDate } from '@/lib/utils'

export default function AdminPage() {
  const [filter, setFilter] = useState<TodoFilter>({
    status: 'all',
    search: '',
    page: 1,
    limit: 10,
  })

  const { data, isLoading } = useTodos(filter)
  const todos = data?.data || []
  const pagination = data?.pagination

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const search = formData.get('search') as string
    setFilter({ ...filter, search, page: 1 })
  }

  const handleStatusFilter = (status: 'all' | 'completed' | 'pending') => {
    setFilter({ ...filter, status, page: 1 })
  }

  const handlePageChange = (page: number) => {
    setFilter({ ...filter, page })
  }

  return (
    <main className="flex-1 p-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 select-none">To Do</h1>
      
      <section className="bg-white rounded-xl p-6 shadow-sm max-w-5xl w-full">
        {/* Search & Filter */}
        <form onSubmit={handleSearch} className="flex items-center space-x-4 mb-6">
          <div className="relative flex-1 max-w-xs">
            <Input
              name="search"
              placeholder="Search"
              className="pl-9 pr-4"
              defaultValue={filter.search}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            Search
          </Button>
          
          {/* Filter Dropdown */}
          <div className="ml-6 relative">
            <button
              type="button"
              className="flex items-center space-x-1 text-gray-700 text-sm hover:text-gray-900"
              onClick={() => {
                // Toggle dropdown menu (simplified)
                const menu = document.getElementById('filter-menu')
                if (menu) {
                  menu.classList.toggle('hidden')
                }
              }}
            >
              <span>Filter by Status</span>
              <ChevronDown className="w-3 h-3" />
            </button>
            
            <div id="filter-menu" className="hidden absolute top-8 right-0 bg-white border rounded-md shadow-lg z-10">
              <button
                onClick={() => handleStatusFilter('all')}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              >
                All
              </button>
              <button
                onClick={() => handleStatusFilter('completed')}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              >
                Completed
              </button>
              <button
                onClick={() => handleStatusFilter('pending')}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              >
                Pending
              </button>
            </div>
          </div>
        </form>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-gray-700 text-sm">
            <thead className="bg-gray-100 text-gray-700 font-semibold">
              <tr>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">To do</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Created</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="text-center py-4">
                    Loading...
                  </td>
                </tr>
              ) : todos.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-4">
                    No todos found
                  </td>
                </tr>
              ) : (
                todos.map((todo) => (
                  <tr key={todo.id} className="border-t border-gray-200">
                    <td className="py-3 px-4">{todo.userName || 'Ahmad Akbar'}</td>
                    <td className="py-3 px-4">{todo.title}</td>
                    <td className="py-3 px-4">
                      <Badge variant={todo.completed ? "success" : "pending"}>
                        {todo.completed ? "Success" : "Pending"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-xs text-gray-500">
                      {formatDate(todo.createdAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <nav className="mt-6 flex justify-end items-center space-x-2 text-gray-700 text-sm">
            <button
              onClick={() => handlePageChange(filter.page - 1)}
              disabled={filter.page === 1}
              className="p-1 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
              .slice(
                Math.max(0, filter.page - 3),
                Math.min(pagination.totalPages, filter.page + 2)
              )
              .map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-8 h-8 rounded ${
                    page === filter.page
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'border border-gray-300 bg-white hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              ))}
            
            <button
              onClick={() => handlePageChange(filter.page + 1)}
              disabled={filter.page === pagination.totalPages}
              className="p-1 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </nav>
        )}
      </section>
    </main>
  )
}