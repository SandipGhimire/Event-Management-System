export type RouteMeta = {
  require_auth?: boolean;
  permissions?: string[] | string;
  only_guest?: boolean;
};

export type RouterConfig = {
  path?: string;
  index?: boolean;
  component?: () => Promise<any>;
  children?: RouterConfig[];
  meta?: RouteMeta;
};
