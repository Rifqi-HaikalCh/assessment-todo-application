// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Middleware untuk proteksi route dengan logika admin yang diperbaiki
 * Mengecek token dan redirect sesuai kondisi
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Ambil token dari cookie atau header
  const token = request.cookies.get('auth-token')?.value
  
  // Handle root path redirect
  if (pathname === '/') {
    const url = request.nextUrl.clone()
    if (token) {
      // Redirect ke todo sebagai default, nanti akan diperiksa role di component level
      url.pathname = '/todo'
    } else {
      url.pathname = '/login'
    }
    return NextResponse.redirect(url)
  }
  
  // Daftar route publik (tidak perlu auth)
  const publicRoutes = ['/login', '/register']
  
  // Daftar route yang memerlukan auth
  const protectedRoutes = ['/todo', '/admin', '/profile']
  
  // Daftar route khusus admin
  const adminRoutes = ['/admin']
  
  // Cek apakah route publik
  const isPublicRoute = publicRoutes.includes(pathname)
  
  // Cek apakah route protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  
  // Cek apakah route admin
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route))
  
  // Jika tidak ada token dan mencoba akses protected route
  if (!token && isProtectedRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }
  
  // Jika ada token dan mencoba akses public route (login/register)
  if (token && (pathname === '/login' || pathname === '/register')) {
    const url = request.nextUrl.clone()
    url.pathname = '/todo'
    return NextResponse.redirect(url)
  }
  
  // PERBAIKAN: Logika untuk admin route
  // Validasi role akan dilakukan di component level karena kita tidak bisa decode JWT di middleware
  // Tapi kita bisa menambahkan header untuk memberikan info bahwa ini admin route
  if (isAdminRoute) {
    const response = NextResponse.next()
    response.headers.set('x-admin-route', 'true')
    return response
  }
  
  // PERBAIKAN: Logika untuk todo route
  // Jika user mengakses /todo, kita akan biarkan component yang menentukan redirect
  // berdasarkan role (admin akan diredirect ke /admin, user biasa tetap di /todo)
  if (pathname.startsWith('/todo')) {
    const response = NextResponse.next()
    response.headers.set('x-user-route', 'true')
    return response
  }
  
  return NextResponse.next()
}

/**
 * Konfigurasi matcher untuk middleware
 * Hanya jalankan middleware untuk route tertentu
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}