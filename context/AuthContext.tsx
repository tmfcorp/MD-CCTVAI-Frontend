"use client";

import { authAPI } from "@/services/api/authAPI";
import { App } from "antd";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from 'js-cookie';

interface User {
    user_id: string;
    id?: string; // optional (since duplicate)
    email: string;
    name: string;
    role_id: string;
    role_label: string;
    access_token: string;
    refresh_token: string;
    token_type?: string;
    status?: "active" | "inactive";
}
interface AuthContextType {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    token: string | null;
    setToken: React.Dispatch<React.SetStateAction<string | null>>;
    login: (data: { email: string; password: string }) => Promise<any>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const { message } = App.useApp();
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedUser = localStorage.getItem("user");
            const storedToken = localStorage.getItem("authToken");

            if (storedUser) setUser(JSON.parse(storedUser));
            if (storedToken) setToken(storedToken);
        }
    }, []);

    const login = async (data: { email: string; password: string }) => {
        const res = await authAPI.login(data);

        console.log(res);

        if (res.success) {
            setUser(res.data);
            setToken(res.data.access_token);

            localStorage.setItem("authToken", res.data.access_token);
            localStorage.setItem("user", JSON.stringify(res.data));

            Cookies.set("authToken", res.data.access_token)

            return { success: true };
        } else {
            message.error(res.message || "Login failed");
            return { success: false };
        }
    };

    const logout = async () => {
        try {
            const res = await authAPI.logout();

            console.log(res);
            if (!res.success) {
                message.error(res.message || "Logout failed");
            }
        } catch {
            // message.error("Logout failed");
        } finally {
            router.push("/login");
            Cookies.remove("authToken");
            setUser(null);
            setToken(null);
            localStorage.removeItem("user");
            localStorage.removeItem("authToken");

        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                token,
                setToken,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider");
    }
    return context;
}; 