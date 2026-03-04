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
    roleList: any[];
    setRoleList: React.Dispatch<React.SetStateAction<any[]>>;
    getRoleList: (data: any) => Promise<any>;
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

    const getRoleList = async (data: any) => {
        const res = await roleAPI.getRoleList(data);

        console.log("ROLELIST", res);

        setRoleList(res.data);
    }

    return (
        <DataContext.Provider
            value={{
                userList,
                setUserList,
                getUserList,
                addUser,
                editUser,
                roleList,
                setRoleList,
                getRoleList,
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