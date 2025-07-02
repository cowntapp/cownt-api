import { z } from 'zod';
import { SEX, ORIGIN, ABSENCE } from '../../animalsConsts';

function validateDate(val: string) {
  const ms = Number(val);
  return !isNaN(ms) && !isNaN(new Date(ms).getTime());
}

// Sheep Create/Update Schemas
export type CreateSheepSchema = z.infer<typeof createSheepSchema>;
export const createSheepSchema = z
  .object({
    longCode: z.string().min(10).max(16),
    breed: z.string(),
    sex: z.nativeEnum(SEX),
    birthDate: z
      .string()
      .optional()
      .refine(
        (val) => val === undefined || validateDate(val),
        'birthDate must be a valid date timestamp in milliseconds'
      ),
    weight: z.string().min(1).max(10).optional(),
    origin: z.nativeEnum(ORIGIN),
    buyPrice: z.number().nonnegative().int().optional(),
    salePrice: z.number().nonnegative().int().optional(),
    absence: z.nativeEnum(ABSENCE).nullable(),
    characteristics: z.array(z.string()).optional(),
    mother: z.string().optional(),
    children: z.array(z.string()).optional(),
  })
  .superRefine((data, ctx) => {
    // origin rules
    if (data.origin === ORIGIN.BORN) {
      if (!data.mother) {
        ctx.addIssue({
          path: ['mother'],
          message: 'Mother is required when origin is Born',
          code: z.ZodIssueCode.custom,
        });
      }
      if (data.birthDate === undefined) {
        ctx.addIssue({
          path: ['birthDate'],
          message: 'birthDate is required when origin is Born',
          code: z.ZodIssueCode.custom,
        });
      }
    } else if (data.origin === ORIGIN.BOUGHT) {
      if (data.mother) {
        ctx.addIssue({
          path: ['mother'],
          message: 'Mother must be null when origin is Bought',
          code: z.ZodIssueCode.custom,
        });
      }
    }
  });

export type UpdateSheepSchema = z.infer<typeof updateSheepSchema>;
export const updateSheepSchema = z.object({
  weight: z.string().min(1).max(10).nullable().optional(),
  buyPrice: z.number().nonnegative().int().nullable().optional(),
  salePrice: z.number().nonnegative().int().nullable().optional(),
  absence: z.nativeEnum(ABSENCE).nullable().optional(),
  characteristics: z.array(z.string()).optional(),
});

// Breed Create/Update Schemas
export type CreateBreedSchema = z.infer<typeof createBreedSchema>;
export const createBreedSchema = z.object({
  value: z.string().min(2).max(20),
});
export type UpdateBreedSchema = z.infer<typeof updateBreedSchema>;
export const updateBreedSchema = createBreedSchema.partial();

// Characteristics Create/Update Schemas
export type CreateCharacteristicSchema = z.infer<
  typeof createCharacteristicSchema
>;
export const createCharacteristicSchema = z.object({
  value: z.string().min(2).max(20),
});
export type UpdateCharacteristicSchema = z.infer<
  typeof updateCharacteristicSchema
>;
export const updateCharacteristicSchema = createCharacteristicSchema.partial();
