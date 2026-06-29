"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildPaginatedMeta = buildPaginatedMeta;
exports.buildSkipTake = buildSkipTake;
function buildPaginatedMeta(opts) {
    return {
        total: opts.total,
        page: opts.page,
        limit: opts.limit,
        totalPages: Math.ceil(opts.total / opts.limit),
    };
}
function buildSkipTake(page, limit) {
    const safePage = Math.max(1, page);
    const safeLimit = Math.min(100, Math.max(1, limit));
    return {
        skip: (safePage - 1) * safeLimit,
        take: safeLimit,
    };
}
//# sourceMappingURL=paginate.util.js.map