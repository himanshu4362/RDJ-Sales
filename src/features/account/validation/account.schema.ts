import { z } from 'zod';

export const signInSchema = z.object({
  phone: z.string().trim().regex(/^\d{10}$/, 'Must be a valid 10-digit phone number.'),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
});

export const registerSchema = z.object({
  displayName: z.string().trim().min(2, 'Name must be at least 2 characters.').max(100),
  phone: z.string().trim().regex(/^\d{10}$/, 'Must be a valid 10-digit phone number.'),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
  cityDistrict: z.string().trim().optional(),
  acceptTerms: z.literal(true, { message: 'You must accept the terms to create an account.',}),
});

export type SignInFormData = z.infer<typeof signInSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;