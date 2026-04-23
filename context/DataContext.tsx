"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { userAPI } from "@/services/api/userAPI";
import { message } from "antd";
import { buildCacheKey } from "@/components/cacheKey";

import { roleAPI } from "@/services/api/roleAPI";
import { useAuth } from "./AuthContext";
import { showApiErrors } from "@/lib/APIError";
import { useAbility } from "./AbilityContext";
import { permissionGroupsAPI } from "@/services/api/permissionGroupsAPI";
import { permissionsAPI } from "@/services/api/permissionsAPI";
import { employeeAPI } from "@/services/api/employeeAPI";

interface UserList {
    id: string;
    email: string;
    name: string;
    role_id: string;
    role_label: string;
    status: boolean;
    password?: string;
}

interface DataContextType {
    userList: UserList[];
    userTotal: number;
    userLoading: boolean;
    setUserList: React.Dispatch<React.SetStateAction<UserList[]>>;
    setUserTotal: React.Dispatch<React.SetStateAction<number>>;
    getUserList: (data: any) => Promise<any>;
    addUser: (data: any) => Promise<any>;
    editUser: (data: any) => Promise<any>;
    deleteUser: (data: any) => Promise<any>;
    roleList: any[];
    roleTotal: number;
    roleLoading: boolean;
    setRoleList: React.Dispatch<React.SetStateAction<any[]>>;
    setRoleTotal: React.Dispatch<React.SetStateAction<number>>;
    getRoleList: (data: any) => Promise<any>;
    addRole: (data: any) => Promise<any>;
    editRole: (data: any) => Promise<any>;
    deleteRole: (data: any) => Promise<any>;
    permissionGroupsList: any[];
    permissionGroupsTotal: number;
    permissionGroupsLoading: boolean;
    setPermissionGroupsList: React.Dispatch<React.SetStateAction<any[]>>;
    setPermissionGroupsTotal: React.Dispatch<React.SetStateAction<number>>;
    getPermissionGroupsList: (data: any) => Promise<any>;
    addPermissionGroup: (data: any) => Promise<any>;
    editPermissionGroup: (data: any) => Promise<any>;
    deletePermissionGroup: (data: any) => Promise<any>;
    allPermissions: any[];
    employeeList: any[];
    employeeTotal: number;
    employeeLoading: boolean;
    setEmployeeList: React.Dispatch<React.SetStateAction<any[]>>;
    setEmployeeTotal: React.Dispatch<React.SetStateAction<number>>;
    getEmployeeList: (data: any) => Promise<any>;
    addEmployee: (data: any) => Promise<any>;
    editEmployee: (data: any) => Promise<any>;
    deleteEmployee: (data: any) => Promise<any>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
    const { user } = useAuth();
    const { permissions } = useAbility();

    const [userLoading, setUserLoading] = useState<boolean>(true);
    const [userList, setUserList] = useState<UserList[]>([]);
    const [userTotal, setUserTotal] = useState<number>(0);
    const userCache = useRef<
        Record<string, { data: any[]; total: number }>
    >({});

    const [roleLoading, setRoleLoading] = useState<boolean>(true);
    const [roleList, setRoleList] = useState<any[]>([]);
    const [roleTotal, setRoleTotal] = useState<number>(0);
    const roleCache = useRef<
        Record<string, { data: any[]; total: number }>
    >({});

    const [permissionGroupsLoading, setPermissionGroupsLoading] = useState<boolean>(true);
    const [permissionGroupsList, setPermissionGroupsList] = useState<any[]>([]);
    const [permissionGroupsTotal, setPermissionGroupsTotal] = useState<number>(0);
    const permissionGroupCache = useRef<
        Record<string, { data: any[]; total: number }>
    >({});
    const [allPermissions, setAllPermissions] = useState<any[]>([]);

    const [employeeLoading, setEmployeeLoading] = useState<boolean>(true);
    const [employeeList, setEmployeeList] = useState<any[]>([]);
    const [employeeTotal, setEmployeeTotal] = useState<number>(0);
    const employeeCache = useRef<
        Record<string, { data: any[]; total: number }>
    >({});



    const { abilityFor } = useAbility();

    const { canRead: canReadTenant } = abilityFor("tenant");
    const { canRead: canReadNotification } = abilityFor("notification");
    const { canRead: canReadAi } = abilityFor("ai");
    const { canRead: canReadVideo } = abilityFor("video");
    const { canRead: canReadPermissiongroups } = abilityFor("permissiongroups");
    const { canRead: canReadRoles } = abilityFor("roles");
    const { canRead: canReadUsers } = abilityFor("user");
    const { canRead: canReadEmployees } = abilityFor("employee");
    const { canRead: canReadGroups } = abilityFor("groups");
    const { canRead: canReadCameras } = abilityFor("camera");

    useEffect(() => {
        if (user && permissions.length > 0) {
            canReadUsers && getUserList({ forceRefresh: true, firstLoad: true });
            canReadRoles && getRoleList({ forceRefresh: true, firstLoad: true });
            canReadPermissiongroups && getPermissionGroupsList({ forceRefresh: true, firstLoad: true });
            canReadEmployees && getEmployeeList({ forceRefresh: true, firstLoad: true });
            getAllPermissions({});
        }
    }, [user, permissions]);

    const getUserList = async (data: any) => {

        const { page, pageSize, search, forceRefresh, sortField, sortOrder, firstLoad } = data;

        if (firstLoad) setUserLoading(true);

        const key = buildCacheKey(
            "user",
            page,
            pageSize,
            search || "",
            sortField || "",
            sortOrder || ""
        );

        if (!forceRefresh && userCache.current[key]) {
            const cachedData: any = userCache.current[key];
            setUserList(cachedData.data);
            setUserTotal(cachedData.total);
            setUserLoading(false);
            return { data: { data: cachedData.data, total: cachedData.total } };
        }

        const res = await userAPI.getUserList({
            page,
            pageSize,
            search,
            sortField,
            sortOrder,
            excludeUserId: user?.user_id
        })

        if (res?.data) {
            const { data: list, total } = res.data;
            setUserList(list);
            setUserTotal(total);
            setUserLoading(false);
            userCache.current[key] = { data: list, total } as any;
        }

        setUserLoading(false);
        return res;
    };

    const addUser = async (data: any) => {
        try {
            const res = await userAPI.addUser(data);
            console.log("ADDUSER", res);

            if (res.success) {
                Object.keys(userCache.current).forEach((key) => {
                    if (key.startsWith("user_")) {
                        delete userCache.current[key];
                    }
                });
                getUserList({ forceRefresh: true });

                return { success: true };
            } else {
                showApiErrors(res);
                return { success: false };
            }
        } catch (error: any) {
            console.error(error);
            message.error(error.message || 'API call failed');
            return { success: false };
        }
    };

    const editUser = async (data: any) => {
        try {
            const res = await userAPI.editUser(data);

            console.log("EDITUSER", res);

            if (res.success) {
                Object.keys(userCache.current).forEach((key) => {
                    if (key.startsWith("user_")) {
                        delete userCache.current[key];
                    }
                });
                getUserList({ forceRefresh: true });

                return { success: true };
            } else {
                showApiErrors(res);
                return { success: false };
            }
        } catch (error: any) {
            console.error(error);
            message.error(error.message || 'API call failed');
            return { success: false };
        }
    }

    const deleteUser = async (data: any) => {
        try {
            const res = await userAPI.deleteUser(data);

            console.log("DELETEUSER", res);

            if (res.success) {
                Object.keys(userCache.current).forEach((key) => {
                    if (key.startsWith("user_")) {
                        delete userCache.current[key];
                    }
                });
                getUserList({ forceRefresh: true });

                return { success: true };
            } else {
                showApiErrors(res);
                return { success: false };
            }
        } catch (error: any) {
            console.error(error);
            message.error(error.message || 'API call failed');
            return { success: false };
        }
    }

    const getRoleList = async (data: any) => {
        const { page, pageSize, search, forceRefresh, sortField, sortOrder, firstLoad } = data;
        if (firstLoad) setRoleLoading(true);
        const key = buildCacheKey(
            "role",
            page,
            pageSize,
            search || "",
            sortField || "",
            sortOrder || ""
        );


        if (!forceRefresh && roleCache.current[key]) {
            const cachedData: any = roleCache.current[key];
            setRoleList(cachedData.data);
            setRoleTotal(cachedData.total);
            setRoleLoading(false);
            return { data: { data: cachedData.data, total: cachedData.total } };
        }

        const res = await roleAPI.getRoleList({
            page,
            pageSize,
            search,
            sortField,
            sortOrder,
        });

        if (res?.data) {
            const { data: list, total } = res.data;
            setRoleList(list);
            setRoleTotal(total);
            roleCache.current[key] = { data: list, total };
        }

        setRoleLoading(false);
        return res;
    }

    const addRole = async (data: any) => {
        try {
            const res = await roleAPI.addRole(data);

            console.log("ADDROLE", res);

            if (res.success) {
                Object.keys(roleCache.current).forEach((key) => {
                    if (key.startsWith("role_")) {
                        delete roleCache.current[key];
                    }
                });
                getRoleList({ forceRefresh: true });

                return { success: true };
            } else {
                showApiErrors(res);
                return { success: false };
            }
        } catch (error: any) {
            console.error(error);
            return { success: false };
        }
    }

    const editRole = async (data: any) => {
        try {
            const res = await roleAPI.editRole(data);

            console.log("EDITROLE", res);

            if (res.success) {
                Object.keys(roleCache.current).forEach((key) => {
                    if (key.startsWith("role_")) {
                        delete roleCache.current[key];
                    }
                });
                getRoleList({ forceRefresh: true });

                return { success: true };
            } else {
                showApiErrors(res);
                return { success: false };
            }
        } catch (error: any) {
            console.error(error);
            return { success: false };
        }
    }

    const deleteRole = async (data: any) => {
        try {
            const res = await roleAPI.deleteRole(data);

            console.log("DELETEROLE", res);

            if (res.success) {
                Object.keys(roleCache.current).forEach((key) => {
                    if (key.startsWith("role_")) {
                        delete roleCache.current[key];
                    }
                });
                getRoleList({ forceRefresh: true });

                return { success: true };
            } else {
                showApiErrors(res);
                return { success: false };
            }
        } catch (error: any) {
            console.error(error);
            return { success: false };
        }
    }

    const getPermissionGroupsList = async (data: any) => {
        const { page, pageSize, search, forceRefresh, sortField, sortOrder, firstLoad } = data;
        if (firstLoad) setPermissionGroupsLoading(true);

        const key = buildCacheKey(
            "permissionGroup",
            page,
            pageSize,
            search || "",
            sortField || "",
            sortOrder || ""
        );

        if (!forceRefresh && permissionGroupCache.current[key]) {
            const cachedData: any = permissionGroupCache.current[key];
            setPermissionGroupsList(cachedData.data);
            setPermissionGroupsTotal(cachedData.total);
            setPermissionGroupsLoading(false);
            return { data: { data: cachedData.data, total: cachedData.total } };
        }

        const res = await permissionGroupsAPI.getPermissionGroupsList({
            page,
            pageSize,
            search,
            sortField,
            sortOrder,
        });

        if (res?.data) {
            const { data: list, total } = res.data;
            setPermissionGroupsList(list);
            setPermissionGroupsTotal(total);
            permissionGroupCache.current[key] = { data: list, total };
        }

        setPermissionGroupsLoading(false);
        return res;
    }

    const addPermissionGroup = async (data: any) => {
        try {
            const res = await permissionGroupsAPI.addPermissionGroup(data);

            console.log("ADDPERMISSIONGROUP", res);

            if (res.success) {
                Object.keys(permissionGroupCache.current).forEach((key) => {
                    if (key.startsWith("permissionGroup_")) {
                        delete permissionGroupCache.current[key];
                    }
                });
                getPermissionGroupsList({ forceRefresh: true });

                return { success: true };
            } else {
                showApiErrors(res);
                return { success: false };
            }
        } catch (error: any) {
            console.error(error);
            return { success: false };
        }
    }

    const editPermissionGroup = async (data: any) => {
        try {
            const res = await permissionGroupsAPI.editPermissionGroup(data);

            console.log("EDITPERMISSIONGROUP", res);

            if (res.success) {
                Object.keys(permissionGroupCache.current).forEach((key) => {
                    if (key.startsWith("permissionGroup_")) {
                        delete permissionGroupCache.current[key];
                    }
                });
                getPermissionGroupsList({ forceRefresh: true });

                return { success: true };
            } else {
                showApiErrors(res);
                return { success: false };
            }
        } catch (error: any) {
            console.error(error);
            return { success: false };
        }
    }

    const deletePermissionGroup = async (data: any) => {
        try {
            const res = await permissionGroupsAPI.deletePermissionGroup(data);

            console.log("DELETEPERMISSIONGROUP", res);

            if (res.success) {
                Object.keys(permissionGroupCache.current).forEach((key) => {
                    if (key.startsWith("permissionGroup_")) {
                        delete permissionGroupCache.current[key];
                    }
                });
                getPermissionGroupsList({ forceRefresh: true });

                return { success: true };
            } else {
                showApiErrors(res);
                return { success: false };
            }
        } catch (error: any) {
            console.error(error);
            return { success: false };
        }
    }

    const getAllPermissions = async (data: any) => {
        const res = await permissionsAPI.getAllPermissions();

        console.log("ALLPERMISSIONS", res);



        setAllPermissions(res.data);
    }

    const getEmployeeList = async (data: any) => {
        const { page, pageSize, search, forceRefresh, sortField, sortOrder, firstLoad } = data;
        if (firstLoad) setEmployeeLoading(true);
        const key = buildCacheKey(
            "employee",
            page,
            pageSize,
            search || "",
            sortField || "",
            sortOrder || ""
        );


        if (!forceRefresh && employeeCache.current[key]) {
            const cachedData: any = employeeCache.current[key];
            setEmployeeList(cachedData.data);
            setEmployeeTotal(cachedData.total);
            setEmployeeLoading(false);
            return { data: { data: cachedData.data, total: cachedData.total } };
        }

        const res = await employeeAPI.getEmployeeList({
            page,
            pageSize,
            search,
            sortField,
            sortOrder,
        });

        if (res?.data) {
            const { data: list, total } = res.data;
            setEmployeeList(list);
            setEmployeeTotal(total);
            employeeCache.current[key] = { data: list, total };
        }

        setEmployeeLoading(false);
        return res;
    }

    const addEmployee = async (data: any) => {
        try {
            const res = await employeeAPI.addEmployee(data);

            console.log("ADDEMPLOYEE", res);

            if (res.success) {
                Object.keys(employeeCache.current).forEach((key) => {
                    if (key.startsWith("employee_")) {
                        delete employeeCache.current[key];
                    }
                });
                getEmployeeList({ forceRefresh: true });

                return { success: true };
            } else {
                showApiErrors(res);
                return { success: false };
            }
        } catch (error: any) {
            console.error(error);
            return { success: false };
        }
    }

    const editEmployee = async (data: any) => {
        try {
            const res = await employeeAPI.editEmployee(data);

            console.log("EDITEMPLOYEE", res);

            if (res.success) {
                Object.keys(employeeCache.current).forEach((key) => {
                    if (key.startsWith("employee_")) {
                        delete employeeCache.current[key];
                    }
                });
                getEmployeeList({ forceRefresh: true });

                return { success: true };
            } else {
                showApiErrors(res);
                return { success: false };
            }
        } catch (error: any) {
            console.error(error);
            return { success: false };
        }
    }

    const deleteEmployee = async (data: any) => {
        try {
            const res = await employeeAPI.deleteEmployee(data);

            console.log("DELETEEMPLOYEE", res);

            if (res.success) {
                Object.keys(employeeCache.current).forEach((key) => {
                    if (key.startsWith("employee_")) {
                        delete employeeCache.current[key];
                    }
                });
                getEmployeeList({ forceRefresh: true });

                return { success: true };
            } else {
                showApiErrors(res);
                return { success: false };
            }
        } catch (error: any) {
            console.error(error);
            return { success: false };
        }
    }


    return (
        <DataContext.Provider
            value={{
                userList,
                userTotal,
                userLoading,
                setUserList,
                setUserTotal,
                getUserList,
                addUser,
                editUser,
                deleteUser,
                roleList,
                roleTotal,
                roleLoading,
                setRoleList,
                setRoleTotal,
                getRoleList,
                addRole,
                editRole,
                deleteRole,
                permissionGroupsList,
                permissionGroupsLoading,
                permissionGroupsTotal,
                setPermissionGroupsList,
                setPermissionGroupsTotal,
                getPermissionGroupsList,
                addPermissionGroup,
                editPermissionGroup,
                deletePermissionGroup,
                allPermissions,
                employeeList,
                employeeTotal,
                employeeLoading,
                setEmployeeList,
                setEmployeeTotal,
                getEmployeeList,
                addEmployee,
                editEmployee,
                deleteEmployee,
            }}
        >
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error("useData must be used inside DataProvider");
    }
    return context;
};