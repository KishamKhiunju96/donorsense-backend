import { PaginatedMeta } from '../types/api-response.type';
export interface PaginateOptions {
    page: number;
    limit: number;
    total: number;
}
export declare function buildPaginatedMeta(opts: PaginateOptions): PaginatedMeta;
export declare function buildSkipTake(page: number, limit: number): {
    skip: number;
    take: number;
};
