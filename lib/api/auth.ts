import apiClient from './client'
import {
  LoginInput,
  RegisterInput,
  LoginResponse,
  RegisterResponse,
  TokenResponse,
  loginResponseSchema,
  registerResponseSchema,
  tokenResponseSchema,
} from '@/lib/schemas/auth.schema'

/**
 * API untuk login
 */
export async function login(data: LoginInput): Promise<LoginResponse> {
  const response = await apiClient.post('/login', {
    email: data.email,
    password: data.password,
  })
  
  // Validasi response dengan zod
  return loginResponseSchema.parse(response.data)
}

/**
 * API untuk register
 */
export async function register(data: RegisterInput): Promise<RegisterResponse> {
  // Format data untuk API
  const payload = {
    firstName: data.firstName,
    lastName: data.lastName,
    email: `${data.mailAddress}@squareteam.com`,
    phone: `${data.phoneCode}${data.phoneNumber}`,
    country: data.country,
    password: data.password,
    about: data.about,
  }
  
  const response = await apiClient.post('/register', payload)
  
  // Validasi response dengan zod
  return registerResponseSchema.parse(response.data)
}

/**
 * API untuk verifikasi token
 */
export async function verifyToken(): Promise<TokenResponse> {
  const response = await apiClient.get('/verify-token')
  
  // Validasi response dengan zod
  return tokenResponseSchema.parse(response.data)
}

/**
 * API untuk logout (optional - biasanya hanya clear token di client)
 */
export async function logout(): Promise<void> {
  try {
    // Jika API memiliki endpoint logout
    await apiClient.post('/logout')
  } catch (error) {
    // Ignore error karena logout tetap harus berhasil di client
    console.error('Logout API error:', error)
  }
}