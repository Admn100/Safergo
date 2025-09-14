import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

// Login DTO
export const LoginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export class LoginDto extends createZodDto(LoginSchema) {}

// Register DTO
export const RegisterSchema = z.object({
  email: z.string().email('Invalid email format'),
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
  phone: z.string().regex(/^\+?[1-9]\d{8,14}$/, 'Invalid phone number format').optional(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password too long')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase and number'),
  locale: z.enum(['fr', 'ar']).default('fr'),
});

export class RegisterDto extends createZodDto(RegisterSchema) {}

// OTP Request DTO
export const OtpRequestSchema = z.object({
  email: z.string().email().optional(),
  phone: z.string().regex(/^\+?[1-9]\d{8,14}$/).optional(),
  type: z.enum(['email_verification', 'phone_verification', 'password_reset', 'registration']),
}).refine(data => data.email || data.phone, {
  message: 'Either email or phone is required',
});

export class OtpRequestDto extends createZodDto(OtpRequestSchema) {}

// OTP Verify DTO
export const OtpVerifySchema = z.object({
  email: z.string().email().optional(),
  phone: z.string().regex(/^\+?[1-9]\d{8,14}$/).optional(),
  code: z.string().length(6, 'OTP must be 6 digits').regex(/^\d{6}$/, 'OTP must be numeric'),
  type: z.enum(['email_verification', 'phone_verification', 'password_reset', 'registration']),
}).refine(data => data.email || data.phone, {
  message: 'Either email or phone is required',
});

export class OtpVerifyDto extends createZodDto(OtpVerifySchema) {}

// Refresh Token DTO
export const RefreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

export class RefreshTokenDto extends createZodDto(RefreshTokenSchema) {}

// Reset Password DTO
export const ResetPasswordSchema = z.object({
  email: z.string().email('Invalid email format'),
  code: z.string().length(6, 'OTP must be 6 digits').regex(/^\d{6}$/, 'OTP must be numeric'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password too long')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase and number'),
});

export class ResetPasswordDto extends createZodDto(ResetPasswordSchema) {}

// Change Password DTO
export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password too long')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase and number'),
});

export class ChangePasswordDto extends createZodDto(ChangePasswordSchema) {}