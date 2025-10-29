import { useMutation, useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useAuthStore } from '@/lib/store/auth.store'
import { useTransitionStore } from '@/lib/store/transition.store'
import { login, register, verifyToken } from '@/lib/api/auth'
import { LoginInput, RegisterInput, LoginResponse } from '@/lib/schemas/auth.schema'
import { getErrorMessage } from '@/lib/api/client'

export function useLogin() {
  const router = useRouter()
  const { login: setAuth } = useAuthStore()
  const { showTransition, hideTransition } = useTransitionStore()

  return useMutation({
    mutationFn: (data: LoginInput): Promise<LoginResponse> => login(data),
    onSuccess: (response: LoginResponse) => {
      if (response.success && response.data) {
        const { user, token } = response.data; 
        
        setAuth(user, token)

        showTransition()

        const splashDuration = 2000;
        const fadeOutDuration = 500;

        setTimeout(() => {
          hideTransition();

          setTimeout(() => {
            const destination = user.role === 'admin' ? '/admin' : '/todo'; // Gunakan user dari variabel
            router.push(destination);
            toast.success('Login berhasil!');
          }, fadeOutDuration);

        }, splashDuration);

      } else {
        toast.error(response.message || 'Login gagal: Data tidak ditemukan setelah sukses login.')
      }
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })
}

export function useRegister() {
  const router = useRouter()
  
  return useMutation({
    mutationFn: (data: RegisterInput) => register(data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success('Registrasi berhasil! Silakan login.')
        
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

const ANIMATION_DURATION = 1000;
const FADE_OUT_DURATION = 500; 
const TOTAL_TRANSITION_DURATION = ANIMATION_DURATION + FADE_OUT_DURATION + 100;
export function useLogout() {
  const router = useRouter();
  const { logout: clearAuth } = useAuthStore();
  const { showTransition, hideTransition } = useTransitionStore();

  const handleLogout = async () => {
    try {
      showTransition();

      const animationDuration = 1000;
      const fadeOutDuration = 500;

      const clearAuthTimer = setTimeout(() => {
        clearAuth();
      }, 3500);

      const hideTimer = setTimeout(() => {
        hideTransition();
      }, animationDuration);

      const redirectTimer = setTimeout(() => {
        router.push('/login');
        toast.success('Logout berhasil');
      }, animationDuration + fadeOutDuration);

    } catch (error) {
      console.error('Logout error:', error);
      hideTransition();
      toast.error("Gagal melakukan logout.");
    }
  };

  return handleLogout;
}

export function useCurrentUser() {
  return useAuthStore((state) => state.user)
}

export function useIsAdmin() {
  const user = useCurrentUser()
  return user?.role === 'admin'
}