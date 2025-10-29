import { useMutation, useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useAuthStore } from '@/lib/store/auth.store'
import { useTransitionStore } from '@/lib/store/transition.store'
import { login, register, verifyToken } from '@/lib/api/auth'
import { LoginInput, RegisterInput } from '@/lib/schemas/auth.schema'
import { getErrorMessage } from '@/lib/api/client'

/**
 * Hook untuk login
 */
export function useLogin() {
  const router = useRouter()
  const { login: setAuth } = useAuthStore()
  const { showTransition, hideTransition } = useTransitionStore()
  
  return useMutation({
    mutationFn: (data: LoginInput) => login(data),
    onSuccess: (response) => {
      if (response.success && response.data) {
        // Simpan auth data ke store
        setAuth(response.data.user, response.data.token)
        
        // Tampilkan animasi transisi
        showTransition()
        
        // Tunggu animasi, lalu redirect dan sembunyikan transisi
        setTimeout(() => {
          const destination = response.data.user.role === 'admin' ? '/admin' : '/todo';
          router.push(destination);
          
          // Sembunyikan overlay setelah navigasi dimulai
          hideTransition();
          toast.success('Login berhasil!');

        }, 2000) // Durasi untuk melihat animasi

      } else {
        toast.error(response.message || 'Login gagal')
      }
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })
}

/**
 * Hook untuk register
 */
export function useRegister() {
  const router = useRouter()
  
  return useMutation({
    mutationFn: (data: RegisterInput) => register(data),
    onSuccess: (response) => {
      if (response.success) {
        // Tampilkan pesan sukses
        toast.success('Registrasi berhasil! Silakan login.')
        
        // Redirect ke halaman login
        router.push('/login')
      } else {
        toast.error(response.message || 'Registrasi gagal')
      }
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })
}

/**
 * Hook untuk verifikasi token
 */
export function useVerifyToken() {
  const { setUser, setLoading, logout } = useAuthStore()
  
  return useQuery({
    queryKey: ['verify-token'],
    queryFn: async () => {
      try {
        const response = await verifyToken()
        if (response.valid && response.user) {
          setUser(response.user)
          setLoading(false)
        } else {
          logout()
        }
        return response
      } catch (error) {
        logout()
        throw error
      }
    },
    retry: false,
  })
}

/**
 * Hook untuk logout
 */
export function useLogout() {
  const router = useRouter()
  const { logout: clearAuth } = useAuthStore()
  
  const handleLogout = async () => {
    try {
      // Clear auth state
      clearAuth()
      
      // Tampilkan pesan
      toast.success('Logout berhasil')
      
      // Redirect ke login
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }
  
  return handleLogout
}

/**
 * Hook untuk mendapatkan current user
 */
export function useCurrentUser() {
  return useAuthStore((state) => state.user)
}

/**
 * Hook untuk check apakah user adalah admin
 */
export function useIsAdmin() {
  const user = useCurrentUser()
  return user?.role === 'admin'
}