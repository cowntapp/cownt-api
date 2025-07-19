import { z } from 'zod';

export type CreateOwnerSchema = z.infer<typeof createOwnerSchema>;
export const createOwnerSchema = z.object({
  value: z.string().min(2).max(40),
});
export type UpdateOwnerSchema = z.infer<typeof updateOwnerSchema>;
export const updateOwnerSchema = createOwnerSchema;
