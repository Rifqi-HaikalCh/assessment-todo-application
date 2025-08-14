// lib/schemas/admin.schema.ts
import { z } from 'zod'

/**
 * Schema untuk User dalam konteks admin
 */
export const adminUserSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  email: z.string(),
})

/**
 * Schema untuk Todo item dalam halaman admin
 * Menampilkan informasi user yang membuat todo
 */
export const adminTodoSchema = z.object({
  id: z.string(),
  item: z.string(),
  userId: z.string(),
  isDone: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
  user: adminUserSchema.optional(), // Informasi user yang membuat todo
})

/**
 * Schema untuk response list todos admin
 */
export const adminTodoListResponseSchema = z.object({
  content: z.object({
    entries: z.array(adminTodoSchema),
    totalData: z.number(),
    totalPage: z.number(),
  }),
  message: z.string(),
  errors: z.array(z.string()),
})

/**
 * Schema untuk filter admin
 */
export const adminFilterSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  search: z.string().optional(),
  status: z.enum(['all', 'success', 'pending']).default('all'),
  userId: z.string().optional(), // Filter berdasarkan user tertentu
})

// Type exports
export type AdminUser = z.infer<typeof adminUserSchema>
export type AdminTodo = z.infer<typeof adminTodoSchema>
export type AdminTodoListResponse = z.infer<typeof adminTodoListResponseSchema>
export type AdminFilter = z.infer<typeof adminFilterSchema>