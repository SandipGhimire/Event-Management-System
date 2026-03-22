const tokenKey: string = "token";
const refreshTokenKey: string = "refresh";

const setToken = function (token: string): void {
  if (token) window.localStorage.setItem(tokenKey, token);
};

const setRefreshToken = function (refresh: string): void {
  if (refresh) window.localStorage.setItem(refreshTokenKey, refresh);
};

const getToken = function (): string | null {
  const token = window.localStorage.getItem(tokenKey);
  return token;
};

const getRefreshToken = function (): string | null {
  const refreshToken = window.localStorage.getItem(refreshTokenKey);
  return refreshToken;
};

const destroyToken = function (): void {
  window.localStorage.removeItem(tokenKey);
  window.localStorage.removeItem(refreshTokenKey);
};

const jwtServices = {
  setToken,
  setRefreshToken,
  getToken,
  getRefreshToken,
  destroyToken,
};

export default jwtServices;
