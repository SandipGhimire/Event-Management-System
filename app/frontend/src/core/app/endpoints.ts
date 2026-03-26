const auth = {
  login: "/auth/login/",
  refresh: "/auth/refresh/",
  logout: "/auth/logout/",
};

const user = {
  self: "/user/self/",
  list: "/user/list/",
  create: "/user/create/",
};

const role = {
  list: "/role/list/",
};

const attendees = {
  list: "/attendees/list/",
  create: "/attendees/create/",
};

const sponsor = {
  list: "/sponsor/list/",
  create: "/sponsor/create/",
};

const task = {
  list: "/task/list/",
  create: "/task/create/",
};
const endpoints = {
  auth,
  user,
  role,
  attendees,
  sponsor,
  task,
};

export default endpoints;
