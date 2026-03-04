import { buildQuery, baseURL, path } from "../utils/buildQuery";

export const permissionsURL = {
  getUserPermissionsById: (data: any) => {
    const query = buildQuery({
      id: data?.user_id,
    });

    console.log("Get permissions by id=>", query);

    return `${baseURL()}${path}permissions/getUserPermissionsById?${query}`;
  },
};
