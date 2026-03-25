import { PaginatedData, FetchParams } from "shared-types";

/**
 * Reusable pagination utility for Prisma models with error handling.
 * @param model The Prisma model delegate (e.g., prisma.user)
 * @param params Pagination, filtering, and sorting parameters
 * @param extraWhere Optional additional where conditions
 * @param options Additional Prisma query options like select or include
 */
export async function paginate<
  Model extends {
    findMany: (args: any) => Promise<any[]>;
    count: (args: any) => Promise<number>;
  },
  Args extends Parameters<Model["findMany"]>[0],
  Result extends Awaited<ReturnType<Model["findMany"]>>[number],
>(
  model: Model,
  params: FetchParams,
  extraWhere: Args["where"] = {},
  options: Omit<Args, "where" | "skip" | "take" | "orderBy"> = {} as Args
): Promise<PaginatedData<Result>> {
  try {
    const { page = 1, pageSize = 10, sortBy, sortOrder = "asc", filters } = params;

    const skip = (Math.max(1, page) - 1) * pageSize;
    const take = pageSize;

    const where = {
      ...(extraWhere as object),
      ...(filters as object),
    };

    const [data, total] = (await Promise.all([
      model.findMany({
        where,
        skip,
        take,
        orderBy: sortBy ? { [sortBy]: sortOrder } : undefined,
        ...options,
      } as Args),
      model.count({ where }),
    ])) as [Result[], number];

    return {
      data,
      meta: {
        total: total ?? 0,
        page,
        pageSize,
        totalPages: Math.ceil((total ?? 0) / pageSize),
      },
    };
  } catch (error) {
    console.error("Pagination error:", error);

    return {
      data: [] as Result[],
      meta: {
        total: 0,
        page: params.page ?? 1,
        pageSize: params.pageSize ?? 10,
        totalPages: 0,
      },
    };
  }
}
