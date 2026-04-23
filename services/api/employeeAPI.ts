import { authHeader } from "../utils/authHeader";
import { employeeURL } from "../url/employeeURL";

export const employeeAPI = {
  async getEmployeeList(data: any): Promise<any> {
    try {
      const response = await fetch(employeeURL.getEmployeeList(data), {
        method: "GET",
        headers: authHeader(),
      });

      return await response.json();
    } catch (error) {
      console.error("Error fetching employee list:", error);
      console.log(error);
      throw error;
    }
  },

  async addEmployee(data: any): Promise<any> {
    try {
      const response = await fetch(employeeURL.addEmployee, {
        method: "POST",
        headers: authHeader(),
        body: JSON.stringify(data),
      });

      return await response.json();
    } catch (error) {
      console.error("Error adding employee:", error);
      throw error;
    }
  },

  async editEmployee(data: any): Promise<any> {
    try {
      const response = await fetch(employeeURL.editEmployee, {
        method: "POST",
        headers: authHeader(),
        body: JSON.stringify(data),
      });

      return await response.json();
    } catch (error) {
      console.error("Error editing employee:", error);
      throw error;
    }
  },

  async deleteEmployee(data: any): Promise<any> {
    try {
      const response = await fetch(employeeURL.deleteEmployee, {
        method: "POST",
        headers: authHeader(),
        body: JSON.stringify(data),
      });

      return await response.json();
    } catch (error) {
      console.error("Error deleting employee:", error);
      throw error;
    }
  },
};
