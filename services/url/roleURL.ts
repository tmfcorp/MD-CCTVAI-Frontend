import { buildQuery, baseURL, path } from "../utils/buildQuery";

export const roleURL = {
  getRoleList: (data: any) => {
    const query = buildQuery({
      limit: data?.limit || 10,
      offset: data?.offset || 0,
    });

    console.log("Get Role =>", query);

    return `${baseURL()}${path}roles/getRoleList?${query}`;
  },
};
