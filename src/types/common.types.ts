export type PaginationQuery = {
  page: number;
  limit: number;
};

export type PaginatedMeta = PaginationQuery & {
  total: number;
  totalPages: number;
};
