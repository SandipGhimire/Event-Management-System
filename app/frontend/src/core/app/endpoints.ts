const auth = {
  login: "/auth/login/",
  refresh: "/auth/refresh/",
  logout: "/auth/logout/",
};

const user = {
  self: "/user/self/",
  list: "/user/list/",
  create: "/user/create/",
  update: "/user/:id/",
  delete: "/user/:id/",
};

const role = {
  list: "/role/list/",
  create: "/role/create/",
  update: "/role/:id/",
  detail: "/role/:id/",
  delete: "/role/:id/",
  permissions: "/role/permissions/list/",
};

const attendees = {
  list: "/attendees/list/",
  create: "/attendees/create/",
  update: "/attendees/update/",
  detail: "/attendees/",
  allIdCards: "/attendees/all-id-cards/",
};

const sponsor = {
  list: "/sponsor/list/",
  create: "/sponsor/create/",
  update: "/sponsor/update/",
  detail: "/sponsor/detail/",
};

const task = {
  list: "/task/list/",
  create: "/task/create/",
  update: "/task/update/",
  detail: "/task/detail/",
  delete: "/task/delete/",
};

const dashboard = {
  stats: "/dashboard/stats/",
};
const endpoints = {
  auth,
  user,
  role,
  attendees,
  sponsor,
  task,
  dashboard,
};

export default endpoints;
