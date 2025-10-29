'use client'

import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {

  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 5
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i)
        pages.push('...')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1)
        pages.push('...')
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i)
      } else {
        pages.push(1)
        pages.push('...')
        pages.push(currentPage - 1)
        pages.push(currentPage)
        pages.push(currentPage + 1)
        pages.push('...')
        pages.push(totalPages)
      }
    }
    
    return pages
  }
  
  if (totalPages <= 1) {
    return null
  }
  
  return (
    <nav 
      aria-label="Pagination" 
      className="flex justify-end items-center gap-2 mt-6 select-none text-gray-600 text-sm"
    >
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
        className={cn(
          "p-1 rounded transition-colors",
          currentPage === 1
            ? "text-gray-300 cursor-not-allowed"
            : "hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
        )}
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      
      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {getPageNumbers().map((page, index) => {
          if (page === '...') {
            return (
              <span key={`ellipsis-${index}`} className="px-2 text-gray-400">
                ...
              </span>
            )
          }
          
          const pageNum = page as number
          const isActive = pageNum === currentPage
          
          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              aria-current={isActive ? 'page' : undefined}
              aria-label={`Page ${pageNum}`}
              className={cn(
                "w-8 h-8 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors",
                isActive
                  ? "bg-blue-600 text-white"
                  : "border border-gray-300 bg-white text-gray-600 hover:bg-gray-100"
              )}
            >
              {pageNum}
            </button>
          )
        })}
      </div>
      
      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
        className={cn(
          "p-1 rounded transition-colors",
          currentPage === totalPages
            ? "text-gray-300 cursor-not-allowed"
            : "hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
        )}
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </nav>
  )
}