import { buildQuery, baseURL, path } from "../utils/buildQuery";

export const userURL = {
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
  getUserList: (data: any) => {
    const query = buildQuery({
      limit: data?.limit || 10,
      offset: data?.offset || 0,
    });

    console.log("Get User =>", query);

    return `${baseURL()}${path}users/getUserList?${query}`;
  },

  addUser: `${baseURL()}${path}users/createUser`,
  editUser: `${baseURL()}${path}users/updateUser`,
  deleteUser: `${baseURL()}${path}users/deleteUser`,
};
