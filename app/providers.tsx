"use client";

import { ThemeProvider, useTheme } from 'next-themes';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider, theme as antTheme } from 'antd';
import React, { useEffect, useState } from 'react';

import Cookies from 'js-cookie';
import { AuthProvider } from '@/context/AuthContext';

export const ThemeColorContext = React.createContext({
    primaryColor: '#1677ff',
    setPrimaryColor: (color: string) => { },
});

const AntdConfigProvider = ({ children }: { children: React.ReactNode }) => {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [primaryColor, setPrimaryColor] = useState('#1677ff');


    useEffect(() => {
        setMounted(true);
        const savedColor = Cookies.get('primaryColor');
        if (savedColor) {
            setPrimaryColor(savedColor);
        }
    }, []);

    const handleSetPrimaryColor = (color: string) => {
        setPrimaryColor(color);
        Cookies.set('primaryColor', color);
    };

    return (
        <ThemeColorContext.Provider value={{ primaryColor, setPrimaryColor: handleSetPrimaryColor }}>
            <ConfigProvider
                theme={{
                    algorithm: (mounted && theme === 'dark') ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
                    token: {
                        colorPrimary: primaryColor,
                    },
                }}
            >
                {children}
            </ConfigProvider>
        </ThemeColorContext.Provider>
    );
};

export function Providers({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <AntdRegistry>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                <AntdConfigProvider>
                    <AuthProvider>
                        {children}
                    </AuthProvider>
                </AntdConfigProvider>
            </ThemeProvider>
        </AntdRegistry>
    );
}
