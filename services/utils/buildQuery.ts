export const buildQuery = (params: Record<string, any>) => {
  return Object.entries(params)
    .filter(
      ([, value]) => value !== undefined && value !== "" && value !== "%20",
    )
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
    )
    .join("&");
};

export const baseURL = () => {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined!");
  }
  return process.env.NEXT_PUBLIC_API_URL;
};

export const wsURL = () => {
  return process.env.NEXT_PUBLIC_API_URL?.replace("http", "ws");
};

export const path = "/api/v1/";
