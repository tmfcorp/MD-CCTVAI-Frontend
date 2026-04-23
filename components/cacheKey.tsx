export const buildCacheKey = (
    module: string,
    page: number,
    pageSize: number,
    search?: string,
    sortField?: string,
    sortOrder?: string
) => {
    return `${module}_${page}_${pageSize}_${search || ""}_${sortField || ""}_${sortOrder || ""}`;
};