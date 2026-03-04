import { buildQuery, baseURL, path } from "../utils/buildQuery";

export const authURL = {
  //   getUsers: (data: any) => {
  //     const query = buildQuery({
  //       //   sort: data?.sort || "asc",
  //       limit: data?.limit || 10,
  //       offset: data?.offset || 0,
  //       search: data?.search || "",
  //       status: data?.status || "",
  //       user_type: data?.user_type || "",
  //       include_remarks: data?.include_remarks || "",
  //       excludeUserId: data.excludeUserId || "",
  //     });

  //     console.log("Get User =>", query);

  //     return `${baseURL()}${path}users/getUsersList?${query}`;
  //   },
  login: `${baseURL()}${path}auth/login`,
  logout: `${baseURL()}${path}auth/logout`,
};
