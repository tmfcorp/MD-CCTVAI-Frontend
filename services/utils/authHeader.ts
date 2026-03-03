// export const authHeader = () => {
//   const token = localStorage.getItem("authToken");

//   return {
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//   };
// };

export function authHeader(): Record<string, string> {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}
