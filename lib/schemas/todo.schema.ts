import { z } from 'zod'

export const todoSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Judul todo wajib diisi'),
  completed: z.boolean().default(false),
  userId: z.string(),
  userName: z.string().optional(),
  createdAt: z.string().or(z.date()),
  updatedAt: z.string().or(z.date()).optional(),
})

export const createTodoSchema = z.object({
  title: z
    .string()
    .min(1, 'Judul todo wajib diisi')
    .max(200, 'Judul maksimal 200 karakter'),
})

export const updateTodoSchema = z.object({
  title: z
    .string()
    .min(1, 'Judul todo wajib diisi')
    .max(200, 'Judul maksimal 200 karakter')
    .optional(),
  completed: z.boolean().optional(),
})

export const todoFilterSchema = z.object({
  status: z.enum(['all', 'completed', 'pending']).default('all'),
  search: z.string().optional(),
  userId: z.string().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
})

export const todoListResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(todoSchema),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
  }).optional(),
})

export const todoResponseSchema = z.object({
  success: z.boolean(),
  data: todoSchema,
  message: z.string().optional(),
})

export const bulkActionSchema = z.object({
  ids: z.array(z.string()).min(1, 'Pilih minimal 1 item'),
  action: z.enum(['delete', 'complete', 'incomplete']),
})

export type Todo = z.infer<typeof todoSchema>
export type CreateTodoInput = z.infer<typeof createTodoSchema>
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>
export type TodoFilter = z.infer<typeof todoFilterSchema>
export type TodoListResponse = z.infer<typeof todoListResponseSchema>
export type TodoResponse = z.infer<typeof todoResponseSchema>
export type BulkAction = z.infer<typeof bulkActionSchema>