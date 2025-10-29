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

export async function login(data: LoginInput): Promise<LoginResponse> {
  const response = await apiClient.post('/login', {
    email: data.email,
    password: data.password,
  })
  
  const apiResponse = response.data
  const transformedResponse = {
    success: true,
    message: apiResponse.message || 'Successfully Logged In!',
    data: {
      user: {
        id: apiResponse.content.user.id,
        name: apiResponse.content.user.fullName,
        email: apiResponse.content.user.email,
        role: apiResponse.content.user.role.toLowerCase() === 'admin' ? 'admin' : 'user'
      },
      token: apiResponse.content.token
    }
  }
  
  return loginResponseSchema.parse(transformedResponse)
}

export async function register(data: RegisterInput): Promise<RegisterResponse> {
  const payload = {
    fullName: `${data.firstName} ${data.lastName}`,
    email: `${data.mailAddress}@squareteam.com`,
    password: data.password,
  }
  
  const response = await apiClient.post('/register', payload)
  
  const apiResponse = response.data
  const transformedResponse = {
    success: true,
    message: apiResponse.message || 'Successfully Registered!',
    data: {
      user: {
        id: apiResponse.content.user.id,
        name: apiResponse.content.user.fullName,
        email: apiResponse.content.user.email,
        role: apiResponse.content.user.role.toLowerCase() === 'admin' ? 'admin' : 'user'
      },
      token: apiResponse.content.token
    }
  }
  
  return registerResponseSchema.parse(transformedResponse)
}

export async function verifyToken(): Promise<TokenResponse> {
  const response = await apiClient.get('/verify-token')
  
  const apiResponse = response.data
  const transformedResponse = {
    valid: true,
    message: apiResponse.message || 'Token is valid',
    user: {
      id: apiResponse.content.user.id,
      name: apiResponse.content.user.fullName,
      email: apiResponse.content.user.email,
      role: apiResponse.content.user.role.toLowerCase() === 'admin' ? 'admin' : 'user'
    }
  }
  
  return tokenResponseSchema.parse(transformedResponse)
}

export async function logout(): Promise<void> {
  try {
    await apiClient.post('/logout')
  } catch (error) {
    console.error('Logout API error:', error)
  }
}