// components/admin/filter-bar.tsx
'use client'

import React from 'react'
import { Search, ChevronDown } from 'lucide-react'
import { AdminFilter } from '@/lib/schemas/admin.schema'

interface FilterBarProps {
  filter: AdminFilter
  onFilterChange: (filter: AdminFilter) => void
}

/**
 * Komponen Filter Bar untuk halaman admin
 * Berisi search input dan filter dropdown
 */
export function FilterBar({ filter, onFilterChange }: FilterBarProps) {
  const [searchValue, setSearchValue] = React.useState(filter.search || '')
  
  /**
   * Handler untuk submit search
   * Bisa dari button atau enter key
   */
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onFilterChange({
      ...filter,
      search: searchValue,
      page: 1, // Reset ke halaman 1 saat search
    })
  }
  
  /**
   * Handler untuk perubahan filter status
   */
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({
      ...filter,
      status: e.target.value as 'all' | 'success' | 'pending',
      page: 1, // Reset ke halaman 1 saat ganti filter
    })
  }
  
  return (
    <form onSubmit={handleSearch} className="flex items-center gap-4 mb-6 max-w-full">
      {/* Search Input dengan Icon */}
      <div className="relative flex-1 max-w-md">
        <input
          type="search"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search"
          className="w-full border border-gray-300 rounded-md pl-9 pr-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
        />
        <Search 
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none"
          aria-hidden="true"
        />
      </div>
      
      {/* Search Button */}
      <button
        type="submit"
        className="bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-1 transition-colors"
      >
        Search
      </button>
      
      {/* Filter by Status Dropdown */}
      <div className="relative">
        <select
          value={filter.status}
          onChange={handleStatusChange}
          aria-label="Filter by Status"
          className="appearance-none border border-gray-300 rounded-md py-2 pl-3 pr-8 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent cursor-pointer"
        >
          <option value="all">Filter by Status</option>
          <option value="success">Success</option>
          <option value="pending">Pending</option>
        </select>
        <ChevronDown 
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 w-3 h-3 pointer-events-none"
          aria-hidden="true"
        />
      </div>
    </form>
  )
}