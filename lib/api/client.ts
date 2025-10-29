import axios, { AxiosError, AxiosInstance } from 'axios'
import { useAuthStore } from '@/lib/store/auth.store'
import { toast } from 'sonner'

const API_BASE_URL = 'https://fe-test-api.nwappservice.com'

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use(
  (config) => {
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

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status
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

export function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError && error.response?.data) {
    const data = error.response.data as any;
    if (Array.isArray(data.errors) && data.errors.length > 0) {
      const firstError = data.errors[0];
      return firstError.charAt(0).toUpperCase() + firstError.slice(1);
    }
    if (data.message) {
      return data.message;
    }
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Terjadi kesalahan yang tidak diketahui';
}