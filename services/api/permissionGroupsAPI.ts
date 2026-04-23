import { authHeader } from "../utils/authHeader";
import { permissionGroupsURL } from "../url/permissionGroupsURL";

export const permissionGroupsAPI = {
  async getPermissionGroupsList(data: any): Promise<any> {
    try {
      const response = await fetch(
        permissionGroupsURL.getPermissionGroupsList(data),
        {
          method: "GET",
          headers: authHeader(),
        },
      );

      return await response.json();
    } catch (error) {
      console.error("Error fetching user permissions by id:", error);
      console.log(error);
      throw error;
    }
  },

  async addPermissionGroup(data: any): Promise<any> {
    try {
      const response = await fetch(
        permissionGroupsURL.addPermissionGroup(data),
        {
          method: "POST",
          headers: authHeader(),
          body: JSON.stringify(data),
        },
      );

      return await response.json();
    } catch (error) {
      console.error("Error fetching user permissions by id:", error);
      console.log(error);
      throw error;
    }
  },

  async editPermissionGroup(data: any): Promise<any> {
    try {
      const response = await fetch(
        permissionGroupsURL.editPermissionGroup(data),
        {
          method: "PUT",
          headers: authHeader(),
          body: JSON.stringify(data),
        },
      );

      return await response.json();
    } catch (error) {
      console.error("Error fetching user permissions by id:", error);
      console.log(error);
      throw error;
    }
  },

  async deletePermissionGroup(data: any): Promise<any> {
    try {
      const response = await fetch(
        permissionGroupsURL.deletePermissionGroup(data),
        {
          method: "DELETE",
          headers: authHeader(),
          body: JSON.stringify(data),
        },
      );

      return await response.json();
    } catch (error) {
      console.error("Error fetching user permissions by id:", error);
      console.log(error);
      throw error;
    }
  },
};
