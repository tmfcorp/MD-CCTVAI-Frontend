import { authHeader } from "../utils/authHeader";
import { roleURL } from "../url/roleURL";

export const roleAPI = {
  async getRoleList(data: any): Promise<any> {
    try {
      const response = await fetch(roleURL.getRoleList(data), {
        method: "GET",
        headers: authHeader(),
      });

      return await response.json();
    } catch (error) {
      console.error("Error fetching role list:", error);
      console.log(error);
      throw error;
    }
  },

  async addRole(data: any): Promise<any> {
    try {
      const response = await fetch(roleURL.addRole, {
        method: "POST",
        headers: authHeader(),
        body: JSON.stringify(data),
      });

      return await response.json();
    } catch (error) {
      console.error("Error adding role:", error);
      console.log(error);
      throw error;
    }
  },

  async editRole(data: any): Promise<any> {
    try {
      const response = await fetch(roleURL.editRole, {
        method: "PUT",
        headers: authHeader(),
        body: JSON.stringify(data),
      });

      return await response.json();
    } catch (error) {
      console.error("Error editing role:", error);
      console.log(error);
      throw error;
    }
  },

  async deleteRole(data: any): Promise<any> {
    try {
      const response = await fetch(roleURL.deleteRole, {
        method: "DELETE",
        headers: authHeader(),
        body: JSON.stringify(data),
      });

      return await response.json();
    } catch (error) {
      console.error("Error deleting role:", error);
      console.log(error);
      throw error;
    }
  },
};
