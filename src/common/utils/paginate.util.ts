import { PaginatedMeta } from '../types/api-response.type';

export interface PaginateOptions {
  page: number;
  limit: number;
  total: number;
}

export function buildPaginatedMeta(opts: PaginateOptions): PaginatedMeta {
  return {
    total: opts.total,
    page: opts.page,
    limit: opts.limit,
    totalPages: Math.ceil(opts.total / opts.limit),
  };
}

export function buildSkipTake(page: number, limit: number): { skip: number; take: number } {
  const safePage = Math.max(1, page);
  const safeLimit = Math.min(100, Math.max(1, limit));
  return {
    skip: (safePage - 1) * safeLimit,
    take: safeLimit,
  };
}
