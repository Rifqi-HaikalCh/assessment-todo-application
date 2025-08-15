'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, Star, ChevronDown, User, LogOut } from 'lucide-react'
import { useCurrentUser } from '@/lib/hooks/use-auth'
import { useSearchStore } from '@/lib/store/search.store'
import { useLogout } from '@/lib/hooks/use-auth'
import { getInitials } from '@/lib/utils'
import Link from 'next/link'

interface HeaderProps {
  showSearch?: boolean
}

export function Header({ showSearch = false }: HeaderProps) {
  const user = useCurrentUser()
  const logout = useLogout()
  const { searchQuery, setSearchQuery } = useSearchStore()
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Handle keyboard shortcut (Ctrl+/)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === '/') {
        e.preventDefault()
        const searchInput = document.getElementById('header-search')
        searchInput?.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200">
      {/* Search atau Star */}
      {showSearch ? (
        <div className="flex items-center space-x-2 text-gray-400 text-sm max-w-md flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              id="header-search"
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search todos... (Ctrl+/)"
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-md text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      ) : (
        <div className="flex items-center space-x-2 text-gray-400 text-sm select-none">
          <Star className="w-5 h-5" />
          <span>Search (Ctrl+/)</span>
        </div>
      )}

      {/* User Info dengan Dropdown */}
      <div className="flex items-center space-x-3 text-gray-900 text-sm font-normal">
        <span>{user?.name || 'User'}</span>
        <div className="relative" ref={dropdownRef}>
          {/* Avatar dengan Dropdown Trigger */}
          <button
            onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
            className="flex items-center space-x-1 hover:bg-gray-50 rounded-lg p-1 transition-colors"
          >
            <div className="relative">
              {/* Avatar */}
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-semibold text-gray-600">
                {getInitials(user?.name || 'User')}
              </div>
              {/* Online Status */}
              <span
                aria-label="Online status indicator"
                className="absolute bottom-0 right-0 block w-3 h-3 rounded-full ring-2 ring-white bg-green-500"
              />
            </div>
            <ChevronDown className="w-3 h-3 text-gray-400" />
          </button>

          {/* Dropdown Menu */}
          {isProfileDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
              <Link
                href="/profile"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => setIsProfileDropdownOpen(false)}
              >
                <User className="w-4 h-4 mr-2" />
                Lihat Profile
              </Link>
              <hr className="my-1 border-gray-100" />
              <button
                onClick={() => {
                  setIsProfileDropdownOpen(false)
                  logout()
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}