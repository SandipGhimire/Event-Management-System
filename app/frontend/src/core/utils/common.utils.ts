const isDevelopment = () => {
  return import.meta.env.VITE_ENV === "development";
};

const isProduction = () => {
  return import.meta.env.VITE_ENV === "production";
};

export { isDevelopment, isProduction };
