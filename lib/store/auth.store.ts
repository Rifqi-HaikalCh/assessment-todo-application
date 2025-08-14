import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

/**
 * Interface untuk User
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
      },
      
      logout: () => {
        // Hapus semua data auth
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        })
        
        // Redirect ke halaman login
        if (typeof window !== 'undefined') {
          window.location.href = '/login'
        }
      },
      
      checkAuth: () => {
        const state = get()
        return !!state.token && !!state.user
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