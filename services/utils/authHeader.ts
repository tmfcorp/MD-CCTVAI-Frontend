export function authHeader(): Record<string, string> {
  if (typeof window === "undefined") {
    // Server-side: cannot read localStorage
    return { "Content-Type": "application/json" };
  }

  const token = localStorage.getItem("authToken") || "";

  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
}
