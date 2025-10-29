import axios, { AxiosError, AxiosInstance } from 'axios'
import { useAuthStore } from '@/lib/store/auth.store'
import { toast } from 'sonner'

/**
 * Base URL untuk API
 */
const API_BASE_URL = 'https://fe-test-api.nwappservice.com'

/**
 * Membuat instance axios dengan konfigurasi default
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Request interceptor untuk menambahkan token ke header
 */
apiClient.interceptors.request.use(
  (config) => {
    // Ambil token dari store
    const token = useAuthStore.getState().token
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

/**
 * Response interceptor untuk handle error secara global
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status
      // Hanya tangani error global di sini, seperti 401
      if (status === 401) {
        toast.error('Sesi Anda telah berakhir. Silakan login kembali.')
        useAuthStore.getState().logout()
      }
    } else if (error.request) {
      toast.error('Tidak dapat terhubung ke server. Periksa koneksi internet Anda.')
    } else {
      toast.error('Terjadi kesalahan yang tidak diketahui')
    }
    
    return Promise.reject(error)
  }
)

export default apiClient

/**
 * Helper function untuk extract error message yang lebih user-friendly
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError && error.response?.data) {
    const data = error.response.data as any;
    // Prioritaskan array 'errors' jika ada dan tidak kosong
    if (Array.isArray(data.errors) && data.errors.length > 0) {
      // Ambil pesan pertama dari array, capitalize huruf pertama
      const firstError = data.errors[0];
      return firstError.charAt(0).toUpperCase() + firstError.slice(1);
    }
    // Fallback ke properti 'message' jika ada
    if (data.message) {
      return data.message;
    }
  }
  // Fallback untuk error lainnya
  if (error instanceof Error) {
    return error.message;
  }
  return 'Terjadi kesalahan yang tidak diketahui';
}