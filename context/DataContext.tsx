"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { userAPI } from "@/services/api/userAPI";
import { message } from "antd";
import { roleAPI } from "@/services/api/roleAPI";
import { useAuth } from "./AuthContext";
import { showApiErrors } from "@/lib/APIError";
import { useAbility } from "./AbilityContext";

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
    setUserList: React.Dispatch<React.SetStateAction<UserList[]>>;
    getUserList: (data: any) => Promise<any>;
    addUser: (data: any) => Promise<any>;
    editUser: (data: any) => Promise<any>;
    deleteUser: (data: any) => Promise<any>;
    roleList: any[];
    setRoleList: React.Dispatch<React.SetStateAction<any[]>>;
    getRoleList: (data: any) => Promise<any>;
    addRole: (data: any) => Promise<any>;
    editRole: (data: any) => Promise<any>;
    deleteRole: (data: any) => Promise<any>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
    const { user } = useAuth();
    const { permissions } = useAbility();
    const [userList, setUserList] = useState<UserList[]>([]);
    const [roleList, setRoleList] = useState<any[]>([]);

    useEffect(() => {
        if (user) {
            getUserList({});
            getRoleList({});
        }
    }, [user]);

    const getUserList = async (data: any) => {
        const res = await userAPI.getUserList(data);

        console.log("USERLIST", res);

        setUserList(res.data);
    }

    const addUser = async (data: any) => {
        try {
            const res = await userAPI.addUser(data);
            console.log("ADDUSER", res);

            if (res.success) {
                message.success('User added successfully');
                getUserList({});

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
                message.success('User edited successfully');
                getUserList({});

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
                getUserList({});

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
        const res = await roleAPI.getRoleList(data);

        console.log("ROLELIST", res);

        setRoleList(res.data);
    }

    const addRole = async (data: any) => {
        try {
            const res = await roleAPI.addRole(data);

            console.log("ADDROLE", res);

            if (res.success) {
                message.success('Role added successfully');
                getRoleList({});

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

    const editRole = async (data: any) => {
        try {
            const res = await roleAPI.editRole(data);

            console.log("EDITROLE", res);

            if (res.success) {
                message.success('Role edited successfully');
                getRoleList({});

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

    const deleteRole = async (data: any) => {
        try {
            const res = await roleAPI.deleteRole(data);

            console.log("DELETEROLE", res);

            if (res.success) {
                message.success('Role deleted successfully');
                getRoleList({});

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

    return (
        <DataContext.Provider
            value={{
                userList,
                setUserList,
                getUserList,
                addUser,
                editUser,
                deleteUser,
                roleList,
                setRoleList,
                getRoleList,
                addRole,
                editRole,
                deleteRole,
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