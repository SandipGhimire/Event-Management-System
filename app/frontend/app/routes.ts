import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("login", "routes/Auth/Login.tsx"),
  route("dashboard", "routes/dashboard.tsx"),
  route("attendees", "routes/attendees.tsx"),
  route("users", "routes/users.tsx"),
  route("scanned", "routes/scanned.tsx"),
  route("scanner", "routes/scanner.tsx"),
] satisfies RouteConfig;
