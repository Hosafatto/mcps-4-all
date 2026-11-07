import { z } from 'zod';

export const apiRequestSchema = {
  url: z
    .string()
    .url()
    .refine((value) => new URL(value).protocol === 'https:', {
      message: 'Only HTTPS URLs are allowed',
    })
    .describe('HTTPS URL of the API endpoint'),

  timeoutMs: z
    .number()
    .int()
    .min(1000)
    .max(10000)
    .default(5000)
    .describe('Request timeout in milliseconds'),
};
