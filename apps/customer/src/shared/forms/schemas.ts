import { z } from 'zod';

export const phoneSchema = z.object({
  phone: z
    .string()
    .trim()
    .regex(/^\+?[1-9]\d{9,14}$/, 'Enter a valid phone number.'),
});

export const otpSchema = z.object({
  otp: z.string().regex(/^\d{6}$/, 'Enter the six-digit OTP.'),
});

export const specialInstructionsSchema = z.object({
  notes: z.string().trim().max(240, 'Keep instructions under 240 characters.'),
});

export const modifierSelectionSchema = z
  .object({
    modifierIds: z.array(z.string()),
    minSelections: z.number().int().nonnegative(),
    maxSelections: z.number().int().positive(),
  })
  .superRefine((value, context) => {
    if (
      value.modifierIds.length < value.minSelections ||
      value.modifierIds.length > value.maxSelections
    ) {
      context.addIssue({
        code: 'custom',
        message: 'Modifier selection is outside the allowed range.',
      });
    }
  });

export type PhoneForm = z.infer<typeof phoneSchema>;
