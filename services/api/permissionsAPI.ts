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
};
