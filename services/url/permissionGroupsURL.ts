import { buildQuery, baseURL, path } from "../utils/buildQuery";

export const permissionGroupsURL = {
  getPermissionGroupsList: (data: any) => {
    const query = buildQuery({
      limit: data?.limit || 10,
      offset: data?.offset || 0,
    });

    console.log("Get permission groups list=>", query);

    return `${baseURL()}${path}permissionGroups/getPermissionGroupsList?${query}`;
  },

  addPermissionGroup: (data: any) => {
    console.log("Add permission group=>", data);

    return `${baseURL()}${path}permissionGroups/createPermissionGroup`;
  },

  editPermissionGroup: (data: any) => {
    console.log("Edit permission group=>", data);

    return `${baseURL()}${path}permissionGroups/updatePermissionGroup`;
  },

  deletePermissionGroup: (data: any) => {
    console.log("Delete permission group=>", data);

    return `${baseURL()}${path}permissionGroups/deletePermissionGroup`;
  },
};
