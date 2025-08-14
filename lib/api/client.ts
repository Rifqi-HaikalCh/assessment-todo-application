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
    // Handle error berdasarkan status code
    if (error.response) {
      const status = error.response.status
      const message = (error.response.data as any)?.message || 'Terjadi kesalahan'
      
      switch (status) {
        case 401:
          // Token expired atau invalid
          toast.error('Sesi Anda telah berakhir. Silakan login kembali.')
          useAuthStore.getState().logout()
          break
        case 403:
          toast.error('Anda tidak memiliki akses untuk melakukan aksi ini')
          break
        case 404:
          toast.error('Data tidak ditemukan')
          break
        case 422:
          // Validation error - biasanya ditangani di component
          break
        case 500:
          toast.error('Terjadi kesalahan pada server')
          break
        default:
          toast.error(message)
      }
    } else if (error.request) {
      // Request dibuat tapi tidak ada response
      toast.error('Tidak dapat terhubung ke server. Periksa koneksi internet Anda.')
    } else {
      // Error lainnya
      toast.error('Terjadi kesalahan yang tidak diketahui')
    }
    
    return Promise.reject(error)
  }
)

export default apiClient

/**
 * Helper function untuk extract error message
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    return (error.response?.data as any)?.message || error.message || 'Terjadi kesalahan'
  }
  if (error instanceof Error) {
    return error.message
  }
  return 'Terjadi kesalahan yang tidak diketahui'
}