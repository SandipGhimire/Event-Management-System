const isDevelopment = () => {
  return import.meta.env.VITE_ENV === "development";
};

const isProduction = () => {
  return import.meta.env.VITE_ENV === "production";
};

const getBackendFile = (path: string) => {
  return import.meta.env.VITE_API_BASE_URL + "/" + path;
};

export { isDevelopment, isProduction, getBackendFile };
