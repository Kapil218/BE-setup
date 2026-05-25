import type { PaginatedMeta } from "../types/common.types.js";

export const createPaginationMeta = (
  page: number,
  limit: number,
  total: number,
): PaginatedMeta => ({
  page,
  limit,
  total,
  totalPages: Math.max(1, Math.ceil(total / limit)),
});
