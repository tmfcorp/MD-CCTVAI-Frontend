"use client";

import { userAPI } from "@/services/api/authAPI";
import { message } from "antd";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

interface User {
    email: string;
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
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const router = useRouter();

    // ✅ Load from localStorage on mount
    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedUser = localStorage.getItem("user");
            const storedToken = localStorage.getItem("token");

            if (storedUser) setUser(JSON.parse(storedUser));
            if (storedToken) setToken(storedToken);
        }
    }, []);

    // ✅ Save to localStorage when changed
    useEffect(() => {
        if (typeof window !== "undefined") {
            if (user) {
                localStorage.setItem("user", JSON.stringify(user));
            } else {
                localStorage.removeItem("user");
            }

            if (token) {
                localStorage.setItem("token", token);
            } else {
                localStorage.removeItem("token");
            }
        }
    }, [user, token]);

    const login = async (data: { email: string; password: string }) => {
        const res = await userAPI.login(data);

        console.log(res);

        if (res.success) {
            const userData = {
                email: res.data.email,
            };

            setUser(userData);
            setToken(res.data.access_token);

            // ✅ Set cookie for middleware
            Cookies.set("authToken", res.data.access_token, {
                expires: 7,
                secure: true,
                sameSite: "strict",
            });

            return { success: true };
        } else {
            message.error(res.message || "Login failed");
            return { success: false };
        }
    };

    const logout = async () => {
        try {
            const res = await userAPI.logout();

            console.log(res);

            if (res.success) {
                setUser(null);
                setToken(null);
                Cookies.remove("authToken");
                router.push("/login");
            } else {
                message.error(res.message || "Logout failed");
            }
        } catch {
            message.error("Logout failed");
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