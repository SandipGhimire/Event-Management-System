const getNameInitials = (name: string): string => {
    if (!name?.trim()) return "";

    const parts = name.trim().split(/\s+/);
    const first = parts[0]?.[0]?.toUpperCase() ?? "";
    const last = (parts.length > 1 ? parts[parts.length - 1]?.[0]?.toUpperCase() : "") ?? "";

    return first + last;
};

const getEnvironment = () => {
    return import.meta.env.VITE_ENVIRONMENT;
};

const isDevelopment = () => {
    return getEnvironment() == "development";
};

const isProduction = () => {
    return getEnvironment() == "production";
};

export { getNameInitials, getEnvironment, isDevelopment, isProduction };
