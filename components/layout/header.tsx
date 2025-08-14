'use client'

import { Search, Star } from 'lucide-react'
import { useCurrentUser } from '@/lib/hooks/use-auth'
import { getInitials } from '@/lib/utils'

interface HeaderProps {
  showSearch?: boolean
}

export function Header({ showSearch = false }: HeaderProps) {
  const user = useCurrentUser()

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200">
      {/* Search atau Star */}
      {showSearch ? (
        <div className="flex items-center space-x-2 text-gray-400 text-sm">
          <Search className="w-4 h-4" />
          <span>Search (Ctrl+/)</span>
        </div>
      ) : (
        <div className="flex items-center space-x-2 text-gray-400 text-sm select-none">
          <Star className="w-5 h-5" />
          <span>Search (Ctrl+/)</span>
        </div>
      )}

      {/* User Info */}
      <div className="flex items-center space-x-3 text-gray-900 text-sm font-normal">
        <span>{user?.name || 'Ahmad Akbar'}</span>
        <div className="relative">
          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-semibold text-gray-600">
            {getInitials(user?.name || 'Ahmad Akbar')}
          </div>
          {/* Online Status */}
          <span
            aria-label="Online status indicator"
            className="absolute bottom-0 right-0 block w-3 h-3 rounded-full ring-2 ring-white bg-green-500"
          />
        </div>
      </div>
    </header>
  )
}