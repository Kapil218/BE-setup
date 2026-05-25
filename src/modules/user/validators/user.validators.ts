import { z } from "zod";

export const userParamsSchema = z.object({
  id: z.string().cuid(),
});

export const createUserBodySchema = z.object({
  email: z.string().trim().email(),
  name: z.string().trim().min(2).max(100),
});

export const updateUserBodySchema = createUserBodySchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required",
  });

export const listUsersQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().trim().min(1).optional(),
});
