import { useMutation, useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useAuthStore } from '@/lib/store/auth.store'
import { useTransitionStore } from '@/lib/store/transition.store'
import { login, register, verifyToken } from '@/lib/api/auth'
import { LoginInput, RegisterInput, LoginResponse } from '@/lib/schemas/auth.schema'
import { getErrorMessage } from '@/lib/api/client'

/**
 * Hook untuk login
 */
export function useLogin() {
  const router = useRouter()
  const { login: setAuth } = useAuthStore()
  const { showTransition, hideTransition } = useTransitionStore()

  return useMutation({
    mutationFn: (data: LoginInput): Promise<LoginResponse> => login(data), // Tambahkan tipe Promise<LoginResponse>
    onSuccess: (response: LoginResponse) => { // Tambahkan tipe LoginResponse pada response
      // Periksa apakah response sukses DAN memiliki data
      if (response.success && response.data) {
        // Karena kita sudah cek response.data, TypeScript sekarang tahu itu ada
        const { user, token } = response.data; 
        
        // Simpan auth data ke store
        setAuth(user, token)

        // Tampilkan animasi transisi (splash screen)
        showTransition()

        // Durasi splash screen terlihat (misalnya 2 detik)
        const splashDuration = 2000;
        // Durasi fade-out (sesuaikan dengan CSS di LoginTransition, misal 500ms)
        const fadeOutDuration = 500;

        // Tampilkan splash screen selama 'splashDuration'
        setTimeout(() => {
          // Mulai sembunyikan (trigger fade-out)
          hideTransition();

          // Tunggu fade-out selesai, baru redirect
          setTimeout(() => {
            const destination = user.role === 'admin' ? '/admin' : '/todo'; // Gunakan user dari variabel
            router.push(destination);
            toast.success('Login berhasil!');
          }, fadeOutDuration);

        }, splashDuration);

      } else {
        // Jika sukses tapi tidak ada data (seharusnya tidak terjadi berdasarkan API), atau jika tidak sukses
        toast.error(response.message || 'Login gagal: Data tidak ditemukan setelah sukses login.')
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