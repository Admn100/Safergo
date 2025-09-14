import { z } from 'zod'

export const requestOtpSchema = z.object({
  email: z.string().email().optional(),
  phone: z.string().regex(/^\+?[1-9]\d{8,14}$/).optional(),
  locale: z.enum(['fr', 'ar']).default('fr'),
}).refine(data => data.email || data.phone, {
  message: 'Email ou téléphone requis',
})

export const verifyOtpSchema = z.object({
  email: z.string().email().optional(),
  phone: z.string().optional(),
  code: z.string().length(6),
})

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  photo: z.string().url().optional(),
  locale: z.enum(['fr', 'ar']).optional(),
})

export type RequestOtpDto = z.infer<typeof requestOtpSchema>
export type VerifyOtpDto = z.infer<typeof verifyOtpSchema>
export type UpdateProfileDto = z.infer<typeof updateProfileSchema>