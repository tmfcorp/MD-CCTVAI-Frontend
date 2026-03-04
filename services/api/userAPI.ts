import { authHeader } from "../utils/authHeader";
import { userURL } from "../url/userAPI";

export const userAPI = {
  async getUserList(data: any): Promise<any> {
    try {
      const response = await fetch(userURL.getUserList(data), {
        method: "GET",
        headers: authHeader(),
      });

      return await response.json();
    } catch (error) {
      console.error("Error fetching user list:", error);
      console.log(error);
      throw error;
    }
  },

  async addUser(data: any): Promise<any> {
    try {
      const response = await fetch(userURL.addUser, {
        method: "POST",
        headers: authHeader(),
        body: JSON.stringify(data),
      });

      return await response.json();
    } catch (error) {
      console.error("Error adding user:", error);
      console.log(error);
      throw error;
    }
  },

  async editUser(data: any): Promise<any> {
    try {
      const response = await fetch(userURL.editUser, {
        method: "POST",
        headers: authHeader(),
        body: JSON.stringify(data),
      });

      return await response.json();
    } catch (error) {
      console.error("Error editing user:", error);
      console.log(error);
      throw error;
    }
  },
};
