import type { z } from "zod";
import type {
  createUserBodySchema,
  listUsersQuerySchema,
  updateUserBodySchema,
  userParamsSchema,
} from "../validators/user.validators.js";

export type CreateUserBody = z.infer<typeof createUserBodySchema>;
export type UpdateUserBody = z.infer<typeof updateUserBodySchema>;
export type UserParams = z.infer<typeof userParamsSchema>;
export type ListUsersQuery = z.infer<typeof listUsersQuerySchema>;
