import { authHeader } from "../utils/authHeader";
import { permissionsURL } from "../url/permissionsURL";

export const permissionsAPI = {
  async getUserPermissionsById(data: any): Promise<any> {
    try {
      const response = await fetch(
        permissionsURL.getUserPermissionsById(data),
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

  async getAllPermissions(): Promise<any> {
    try {
      const response = await fetch(permissionsURL.getAllPermissions(), {
        method: "GET",
        headers: authHeader(),
      });

      return await response.json();
    } catch (error) {
      console.error("Error fetching all permissions:", error);
      console.log(error);
      throw error;
    }
  },
};
