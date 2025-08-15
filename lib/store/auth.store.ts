// Auth store pake Zustand - state management buat authentication
// Include persist middleware biar auth state gak hilang pas refresh
// Design pattern yang gua pake: simple tapi powerful - @RifqiHaikal-2025
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

/**
 * Interface User - define structure data user
 */
interface User {
  id: string
  name: string
  email: string
  role: 'user' | 'admin'
}

/**
 * Interface untuk Auth Store
 */
interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  
  // Actions
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  setLoading: (loading: boolean) => void
  login: (user: User, token: string) => void
  logout: () => void
  checkAuth: () => boolean
  syncTokenToCookie: () => void
}

/**
 * Auth store menggunakan Zustand dengan persist
 * Data disimpan di localStorage untuk mempertahankan sesi
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      
      setToken: (token) => set({ token }),
      
      setLoading: (loading) => set({ isLoading: loading }),
      
      login: (user, token) => {
        // Simpan token dan user ke state
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        })
        
        // Simpan token ke cookies untuk middleware
        if (typeof window !== 'undefined') {
          document.cookie = `auth-token=${token}; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Lax`
        }
      },
      
      logout: () => {
        // Hapus semua data auth
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        })
        
        // Hapus token dari cookies
        if (typeof window !== 'undefined') {
          document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
          window.location.href = '/login'
        }
      },
      
      checkAuth: () => {
        const state = get()
        return !!state.token && !!state.user
      },
      
      syncTokenToCookie: () => {
        const state = get()
        if (state.token && typeof window !== 'undefined') {
          document.cookie = `auth-token=${state.token}; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Lax`
        }
      },
    }),
    {
      name: 'auth-storage', // nama key di localStorage
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Hanya simpan data yang diperlukan
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)