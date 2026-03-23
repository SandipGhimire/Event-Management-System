import { beforeRoute } from "../setup/router.setup";
import type { RouteMeta, RouterConfig } from "../types/app/router.type";

/**
 * Merge parent meta with child meta.
 * Child values override parent values.
 * Permissions arrays are concatenated and deduplicated.
 */
function mergeMeta(parent?: RouteMeta, child?: RouteMeta): RouteMeta | undefined {
  if (!parent && !child) return undefined;
  if (!parent) return child;
  if (!child) return parent;

  return {
    require_auth: typeof child.require_auth === "boolean" ? child.require_auth : parent.require_auth,

    permissions:
      child.permissions && parent.permissions
        ? Array.from(
            new Set([
              ...(Array.isArray(parent.permissions) ? parent.permissions : [parent.permissions]),
              ...(Array.isArray(child.permissions) ? child.permissions : [child.permissions]),
            ])
          )
        : child.permissions || parent.permissions,
  };
}

export function buildRoutes(config: RouterConfig[], parentMeta?: RouteMeta): any[] {
  return config.map((r) => {
    const effectiveMeta = mergeMeta(parentMeta, r.meta);

    const route: any = {
      path: r.path,
      index: r.index,

      lazy: async () => {
        const mod = await r.component();

        return {
          Component: mod.default,
          loader: effectiveMeta && !r.children ? () => beforeRoute(r.path || "", effectiveMeta) : undefined,
        };
      },
    };

    if (r.children) {
      route.children = buildRoutes(r.children, effectiveMeta);
    }

    return route;
  });
}
