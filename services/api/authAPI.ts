import { userURL } from "../url/authURL";
import { authHeader } from "../utils/authHeader";

export const userAPI = {
  async login(data: any): Promise<any> {
    try {
      const response = await fetch(userURL.login, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      return await response.json();
    } catch (error) {
      console.error("Error fetching users:", error);
      console.log(error);
      throw error;
    }
  },

  async logout(): Promise<any> {
    try {
      const response = await fetch(userURL.logout, {
        method: "POST",
        headers: authHeader(),
      });

      return await response.json();
    } catch (error) {
      console.error("Error fetching users:", error);
      console.log(error);
      throw error;
    }
  },
};
