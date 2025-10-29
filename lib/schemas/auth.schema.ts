import { z } from 'zod'

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email atau username wajib diisi')
    .refine(
      (val) => val.includes('@') ? z.string().email().safeParse(val).success : val.length >= 3,
      'Email tidak valid atau username minimal 3 karakter'
    ),
  password: z
    .string()
    .min(6, 'Password minimal 6 karakter')
    .max(100, 'Password maksimal 100 karakter'),
  rememberMe: z.boolean().optional(),
})

export const registerSchema = z.object({
  firstName: z
    .string()
    .min(1, 'Nama depan wajib diisi')
    .max(50, 'Nama depan maksimal 50 karakter'),
  lastName: z
    .string()
    .max(50, 'Nama belakang maksimal 50 karakter')
    .optional(),
  phoneCode: z.string().default('+62'),
  phoneNumber: z
    .string()
    .optional(),
  country: z.string().optional(),
  mailAddress: z
    .string()
    .min(3, 'Alamat email minimal 3 karakter')
    .max(50, 'Alamat email maksimal 50 karakter')
    .regex(/^[a-zA-Z0-9._-]+$/, 'Format alamat email tidak valid'),
  password: z
    .string()
    .min(6, 'Password minimal 6 karakter')
    .max(100, 'Password maksimal 100 karakter'),
  confirmPassword: z
    .string()
    .min(6, 'Konfirmasi password minimal 6 karakter'),
  about: z
    .string()
    .max(500, 'Deskripsi maksimal 500 karakter')
    .optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password tidak cocok",
  path: ["confirmPassword"],
})

export const loginResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    token: z.string(),
    user: z.object({
      id: z.string(),
      name: z.string(),
      email: z.string(),
      role: z.enum(['user', 'admin']),
    }),
  }).optional(),
})

export const registerResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    token: z.string(),
    user: z.object({
      id: z.string(),
      name: z.string(),
      email: z.string(),
      role: z.enum(['user', 'admin']),
    }),
  }).optional(),
})

export const tokenResponseSchema = z.object({
  valid: z.boolean(),
  user: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    role: z.enum(['user', 'admin']),
  }).optional(),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type LoginResponse = z.infer<typeof loginResponseSchema>
export type RegisterResponse = z.infer<typeof registerResponseSchema>
export type TokenResponse = z.infer<typeof tokenResponseSchema>