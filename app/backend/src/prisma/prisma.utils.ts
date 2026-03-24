import { PaginatedData, FetchParams } from "shared-types";

/**
 * Reusable pagination utility for Prisma models.
 * @param model The Prisma model delegate (e.g., prisma.user)
 * @param params Pagination, filtering, and sorting parameters
 * @param extraWhere Optional additional where conditions
 */
export async function paginate<T>(model: any, params: FetchParams, extraWhere: any = {}): Promise<PaginatedData<T>> {
  const { page = 1, pageSize = 10, search, sortBy, sortOrder = "asc", filters } = params;

  const skip = (Math.max(1, page) - 1) * pageSize;
  const take = pageSize;

  // Combine filters and extra conditions
  const where = {
    ...extraWhere,
    ...(filters || {}),
  };

  // If search is provided, we might need model-specific logic or a generic 'OR' condition
  // For this generic util, we'll assume 'extraWhere' might already contain search logic
  // if it's complex, otherwise we just use the combined 'where'.

  const [data, total] = await Promise.all([
    model.findMany({
      where,
      skip,
      take,
      orderBy: sortBy ? { [sortBy]: sortOrder } : undefined,
    }),
    model.count({ where }),
  ]);

  return {
    data,
    meta: {
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    },
  };
}
