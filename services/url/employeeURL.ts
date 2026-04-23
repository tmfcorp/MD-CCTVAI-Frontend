import { buildQuery, baseURL, path } from "../utils/buildQuery";

export const employeeURL = {
  getEmployeeList: (data: any) => {
    const query = buildQuery({
      limit: data?.limit || 10,
      offset: data?.offset || 0,
    });

    console.log("Get Employee =>", query);

    return `${baseURL()}${path}employees/getEmployeeList?${query}`;
  },

  addEmployee: `${baseURL()}${path}employees/createEmployee`,
  editEmployee: `${baseURL()}${path}employees/updateEmployee`,
  deleteEmployee: `${baseURL()}${path}employees/deleteEmployee`,
};
