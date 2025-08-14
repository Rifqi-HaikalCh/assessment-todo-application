import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Middleware untuk proteksi route
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
      url.pathname = '/todo'
    } else {
      url.pathname = '/login'
    }
    return NextResponse.redirect(url)
  }
  
  // Daftar route publik (tidak perlu auth)
  const publicRoutes = ['/login', '/register']
  
  // Daftar route yang memerlukan auth
  const protectedRoutes = ['/todo', '/admin']
  
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
  
  // Untuk admin route, perlu validasi role (ini simplified, idealnya decode JWT)
  // Karena kita tidak bisa decode JWT di middleware tanpa secret key,
  // validasi role akan dilakukan di component level
  
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