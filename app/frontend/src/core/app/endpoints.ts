const auth = {
  login: "/auth/login/",
  refresh: "/auth/refresh/",
  logout: "/auth/logout/",
};

const user = {
  self: "/user/self/",
  list: "/user/list/",
};

const role = {
  list: "/role/list/",
};

const attendees = {
  list: "/attendees/list/",
};

const sponsor = {
  list: "/sponsor/list/",
};

const task = {
  list: "/task/list/",
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
