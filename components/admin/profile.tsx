'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store/auth.store'
import { useLogout } from '@/lib/hooks/use-auth'

export function AdminProfile() {
  const router = useRouter()
  const user = useAuthStore(state => state.user)
  const handleLogout = useLogout()
  const [showDropdown, setShowDropdown] = React.useState(false)
  
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('.admin-profile-dropdown')) {
        setShowDropdown(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])
  
  return (
    <div className="relative admin-profile-dropdown">
      {/* Avatar dengan status online - sesuai HTML template */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative w-8 h-8 rounded-full overflow-hidden border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <img 
          alt="Avatar of a man with brown hair, beard, wearing a suit and tie" 
          className="w-full h-full object-cover" 
          src="https://placehold.co/32x32/cccccc/757575?text=Avatar"
        />
        <span 
          aria-label="Online status" 
          className="absolute bottom-0 right-0 block w-3 h-3 rounded-full border-2 border-white bg-green-500"
        />
      </button>
      
      {/* Dropdown Menu */}
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-700">
              {user?.name || 'Unknown User'}
            </p>
            <p className="text-xs text-gray-500">
              {user?.email || 'No email available'}
            </p>
          </div>
          
          <button
            onClick={() => {
              setShowDropdown(false)
              router.back() 
            }}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <i className="fas fa-arrow-left mr-2"></i>
            Kembali
          </button>
          
          <button
            onClick={() => {
              setShowDropdown(false)
              router.push('/admin/settings')
            }}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <i className="fas fa-cog mr-2"></i>
            Pengaturan
          </button>
          
          <hr className="my-1" />
          
          <button
            onClick={() => {
              setShowDropdown(false)
              handleLogout()
            }}
            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            <i className="fas fa-sign-out-alt mr-2"></i>
            Logout
          </button>
        </div>
      )}
    </div>
  )
}