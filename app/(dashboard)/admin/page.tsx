// File: app/(dashboard)/admin/page.tsx
'use client'

import React, { useState, useEffect, useMemo } from 'react' // Import useEffect dan useMemo
import { redirect } from 'next/navigation' // Import redirect
import { Search, ChevronDown, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react'
import { useAdminTodos } from '@/lib/hooks/use-admin-todos'
import { AdminFilter, AdminTodo } from '@/lib/schemas/admin.schema' // Import AdminTodo
import { RoleGuard } from '@/components/auth/role-guard'
import { cn, getInitials } from '@/lib/utils' // Import getInitials
import { toast } from 'sonner'
import { useAuthStore } from '@/lib/store/auth.store' // Import useAuthStore

/**
 * Admin Dashboard - Halaman konten untuk admin.
 * Layout (Sidebar, Header) sekarang ditangani oleh file layout terpisah.
 */
export default function AdminPage() {
  // Cek otentikasi dan role di awal
  const user = useAuthStore(state => state.user)
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)

  useEffect(() => {
    if (!isAuthenticated) {
      redirect('/login');
    } else if (user && user.role !== 'admin') {
      // Jika user login tapi bukan admin, redirect ke todo
      redirect('/todo');
    }
  }, [isAuthenticated, user]);


  const [filter, setFilter] = useState<AdminFilter>({
    page: 1,
    limit: 5, // Sesuaikan limit sesuai kebutuhan
    status: 'all',
    search: '',
  })
  const [searchValue, setSearchValue] = useState('')
  const [isSpinning, setIsSpinning] = useState(false)

  // Gunakan object desctructuring untuk data, isLoading, refetch
  const { data: adminTodosResponse, isLoading, refetch, error } = useAdminTodos(filter)

  const handleRefresh = async () => { // Jadikan async
    setIsSpinning(true)
    try {
      await refetch() // Tunggu refetch selesai
      toast.success('Data berhasil diperbarui')
    } catch (err) {
      toast.error('Gagal memperbarui data')
      console.error("Refresh error:", err)
    } finally {
      // Gunakan setTimeout agar animasi spin terlihat minimal sebentar
      setTimeout(() => setIsSpinning(false), 500);
    }
  }

  // Fungsi format nama user (pastikan ada)
  const formatUserName = (todo: AdminTodo): string => {
    // Berikan tipe return string
    if (todo.user?.fullName) return todo.user.fullName
    // Fallback jika user tidak ada atau tidak punya fullName
    return todo.userId ? `User ${todo.userId.slice(0, 6)}...` : 'Unknown User';
  }

  // Memoize hasil filter dan paginasi
  const processedData = useMemo(() => {
    const allTodos = adminTodosResponse?.content?.entries ?? [];

    // 1. Filter berdasarkan status (Success/Pending)
    let statusFilteredTodos = allTodos;
    if (filter.status === 'success') {
      statusFilteredTodos = allTodos.filter(todo => todo.isDone);
    } else if (filter.status === 'pending') {
      statusFilteredTodos = allTodos.filter(todo => !todo.isDone);
    }

    // 2. Filter berdasarkan search term
    const searchLower = filter.search?.toLowerCase() ?? '';
    const searchFilteredTodos = searchLower
      ? statusFilteredTodos.filter(todo => {
        const todoText = todo.item?.toLowerCase() ?? '';
        const userName = formatUserName(todo).toLowerCase();
        const statusText = todo.isDone ? 'success' : 'pending';
        return todoText.includes(searchLower) || userName.includes(searchLower) || statusText.includes(searchLower);
      })
      : statusFilteredTodos;

    // 3. Paginasi
    const totalData = searchFilteredTodos.length;
    const totalPages = Math.ceil(totalData / filter.limit) || 1;
    const currentPage = Math.max(1, Math.min(filter.page, totalPages)); // Pastikan page valid
    const startIndex = (currentPage - 1) * filter.limit;
    const endIndex = startIndex + filter.limit;
    const paginatedTodos = searchFilteredTodos.slice(startIndex, endIndex);

    return {
      paginatedTodos,
      totalData,
      totalPages,
      currentPage // Kembalikan currentPage yang sudah divalidasi
    }
  }, [adminTodosResponse, filter.status, filter.search, filter.limit, filter.page]);

  // Ekstrak hasil dari processedData
  const { paginatedTodos, totalData, totalPages, currentPage } = processedData;


  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Set search term dan reset page ke 1
    setFilter(prev => ({ ...prev, search: searchValue, page: 1 }))
  }

  const handleStatusFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // Set status filter dan reset page ke 1
    setFilter(prev => ({ ...prev, status: e.target.value as 'all' | 'success' | 'pending', page: 1 }))
  }

  const handlePageChange = (newPage: number) => {
    // Pastikan page baru valid sebelum di-set
    if (newPage >= 1 && newPage <= totalPages) {
      setFilter(prev => ({ ...prev, page: newPage }))
    }
  }

  // Jika user belum terautentikasi atau bukan admin, tampilkan loading atau null
  if (!isAuthenticated || !user || user.role !== 'admin') {
    // Tampilkan loading state sederhana selagi redirect terjadi
    return (
      <div className="flex flex-col h-full bg-gray-50 items-center justify-center">
        <div className="text-gray-500">Loading Access...</div>
      </div>
    );
  }

  // Tampilkan error jika ada masalah fetch data
  if (error) {
    return (
      <div className="flex flex-col h-full bg-gray-50 items-center justify-center p-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> Gagal memuat data todo admin. Coba refresh.</span>
        </div>
      </div>
    );
  }

  return (
    // RoleGuard masih bisa digunakan sebagai lapisan tambahan jika diperlukan,
    // tapi cek di awal useEffect lebih disarankan untuk redirect cepat.
    // <RoleGuard allowedRoles={['admin']} redirectTo="/todo">
    <div className="flex flex-col h-full bg-gray-50">
{/* Page Title */}
      <section className="px-4 lg:px-8 pt-6 pb-1">
        <h1 className="text-xl lg:text-2xl font-bold text-gray-800 select-none">
          To Do Management
        </h1>
      </section>

      {/* Content */}
      <section className="flex-1 px-4 lg:px-8 py-4 lg:py-6 overflow-y-auto">
        <div className="bg-white rounded-lg p-4 lg:p-6 shadow-sm">
          {/* Search and Filter Form */}
          <form onSubmit={handleSearch} className="space-y-4 lg:space-y-0 lg:flex lg:items-center lg:gap-3 mb-6">
            <label className="sr-only" htmlFor="search-admin">Search</label>
            <div className="relative flex-1 lg:max-w-md">
              <input
                className="w-full border border-gray-300 rounded-lg py-2.5 pl-10 pr-4 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                id="search-admin" // Beri ID unik
                placeholder="Search by name, todo, or status..."
                type="search"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>
            <div className="flex flex-col sm:flex-row gap-2 lg:gap-3"> {/* Responsif */}
              <button
                className="bg-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-all shadow-sm w-full sm:w-auto"
                type="submit"
              >
                Search
              </button>
              <div className="relative w-full sm:w-auto">
                <select
                  value={filter.status}
                  onChange={handleStatusFilter}
                  className="appearance-none w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer transition-all shadow-sm"
                >
                  <option value="all">All Status</option>
                  <option value="success">Success</option>
                  <option value="pending">Pending</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
              <button
                type="button"
                onClick={handleRefresh}
                disabled={isSpinning || isLoading} // Disable juga saat loading awal
                className="flex items-center justify-center bg-white border border-gray-300 text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${isSpinning ? 'animate-spin' : ''}`} />
                {isSpinning ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
          </form>

          {/* Table */}
          <div className="overflow-x-auto bg-white rounded-lg border border-gray-200 shadow-sm">
            <table className="w-full text-left text-gray-700 text-sm min-w-[500px]">
              {/* Table Head */}
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <tr>
                  <th className="font-semibold py-4 px-4 lg:px-6 text-xs lg:text-sm text-gray-800 tracking-wide uppercase">Name</th>
                  <th className="font-semibold py-4 px-4 lg:px-6 text-xs lg:text-sm text-gray-800 tracking-wide uppercase">To do</th>
                  <th className="font-semibold py-4 px-4 lg:px-6 text-xs lg:text-sm text-center text-gray-800 tracking-wide uppercase">Status</th>
                </tr>
              </thead>
              {/* Table Body */}
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  // Skeleton Loading Rows
                  [...Array(filter.limit)].map((_, i) => ( // Buat skeleton sejumlah limit
                    <tr key={`skel-${i}`} className="animate-pulse">
                      <td className="py-4 px-4 lg:px-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                          <div className="h-4 bg-gray-200 rounded w-24"></div>
                        </div>
                      </td>
                      <td className="py-4 px-4 lg:px-6">
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                      </td>
                      <td className="py-4 px-4 lg:px-6 text-center">
                        <div className="h-6 w-20 bg-gray-200 rounded-full mx-auto"></div>
                      </td>
                    </tr>
                  ))
                ) : paginatedTodos.length === 0 ? (
                  // Empty State Row
                  <tr className="bg-gray-50/50">
                    <td colSpan={3} className="py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center space-y-2">
                        {/* Icon bisa diganti atau disesuaikan */}
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>
                          {filter.search ? `Tidak ada data cocok dengan "${filter.search}"` : 'Tidak ada data todo'}
                          {filter.status !== 'all' ? ` dengan status "${filter.status}"` : ''}
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  // Data Rows
                  paginatedTodos.map((todo, index) => (
                    <tr
                      key={todo.id}
                      className={cn(
                        "transition-colors duration-150 ease-in-out",
                        "hover:bg-blue-50/50", // Efek hover lebih halus
                        index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                      )}
                    >
                      <td className="py-4 px-4 lg:px-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xs font-semibold shadow-sm flex-shrink-0">
                            {getInitials(formatUserName(todo))} {/* Gunakan getInitials */}
                          </div>
                          <div className="font-medium text-gray-800 group-hover:text-blue-800 transition-colors truncate max-w-[120px] sm:max-w-[200px] lg:max-w-none">
                            {formatUserName(todo)}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 lg:px-6">
                        {/* break-words penting untuk teks panjang */}
                        <div className="text-gray-600 group-hover:text-gray-800 transition-colors break-words max-w-[150px] sm:max-w-[300px] lg:max-w-none leading-relaxed">
                          {todo.item}
                        </div>
                      </td>
                      <td className="py-4 px-4 lg:px-6 text-center">
                        <span className={cn(
                          "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-all shadow-sm border", // Tambah border
                          todo.isDone
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 group-hover:bg-emerald-100" // Warna lebih halus
                            : "bg-amber-50 text-amber-700 border-amber-200 group-hover:bg-amber-100" // Warna lebih halus
                        )}>
                          {/* Titik indikator */}
                          <div className={cn(
                            "w-1.5 h-1.5 rounded-full mr-1.5",
                            todo.isDone ? "bg-emerald-500" : "bg-amber-500"
                          )}></div>
                          {todo.isDone ? 'Success' : 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!isLoading && totalData > 0 && totalPages > 1 && ( // Tampilkan jika lebih dari 1 halaman
            <nav aria-label="Pagination" className="mt-6 flex flex-col sm:flex-row sm:justify-between items-center gap-4">
              <div className="text-sm text-gray-500 order-2 sm:order-1">
                Showing {paginatedTodos.length} of {totalData} results
              </div>
              <div className="flex items-center gap-1 lg:gap-2 order-1 sm:order-2">
                {/* Tombol Previous */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  aria-label="Previous page"
                  className="p-2 text-gray-500 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {/* Nomor Halaman */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                  // Implementasi logic pagination lebih kompleks (ellipsis) bisa ditambahkan di sini jika perlu
                  // Untuk sekarang, tampilkan semua nomor halaman
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    aria-current={pageNumber === currentPage ? "page" : undefined}
                    className={cn(
                      "w-8 h-8 lg:w-9 lg:h-9 text-xs lg:text-sm rounded border focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 transition-colors",
                      pageNumber === currentPage
                        ? "border-blue-600 bg-blue-600 text-white font-semibold shadow-sm"
                        : "border-gray-300 bg-white text-gray-600 hover:bg-gray-100"
                    )}
                  >
                    {pageNumber}
                  </button>
                ))}
                {/* Tombol Next */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  aria-label="Next page"
                  className="p-2 text-gray-500 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </nav>
          )}
        </div>
      </section>
    </div>
    // </RoleGuard>
  )
}