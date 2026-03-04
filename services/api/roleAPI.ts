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
};
