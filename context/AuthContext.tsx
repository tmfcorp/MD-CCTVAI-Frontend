"use client";

import { authAPI } from "@/services/api/authAPI";
import { message } from "antd";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

interface User {
    user_id: string;
    email: string;
    role_id: string;
    access_token: string;
    refresh_token: string;
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

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedUser = Cookies.get("user");
            const storedToken = Cookies.get("authToken");

            if (storedUser) setUser(JSON.parse(storedUser));
            if (storedToken) setToken(storedToken);
        }
    }, []);

    useEffect(() => {
        if (typeof window !== "undefined") {
            if (user) {
                Cookies.set("user", JSON.stringify(user), {
                    expires: 7,
                    secure: true,
                    sameSite: "strict",
                });
            } else {
                Cookies.remove("user");
            }

            if (token) {
                Cookies.set("authToken", token, {
                    expires: 7,
                    secure: true,
                    sameSite: "strict",
                });
            } else {
                Cookies.remove("authToken");
            }
        }
    }, [user, token]);

    const login = async (data: { email: string; password: string }) => {
        const res = await authAPI.login(data);

        console.log(res);

        if (res.success) {
            setUser(res.data);
            setToken(res.data.access_token);

            Cookies.set("authToken", res.data.access_token, {
                expires: 7,
                secure: true,
                sameSite: "strict",
            });

            Cookies.set("user", res.data, {
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
            const res = await authAPI.logout();

            console.log(res);

            if (res.success) {
                setUser(null);
                setToken(null);
                Cookies.remove("user");
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