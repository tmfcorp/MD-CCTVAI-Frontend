"use client";

import React, { useEffect, useState } from 'react';
import { Layout, Button, Avatar, Dropdown, MenuProps, Space, theme as antTheme } from 'antd';
import Sidebar from '@/components/Sidebar';
import { SunOutlined, MoonOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const { Header, Content, Footer } = Layout;

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, logout } = useAuth();
    const { theme, setTheme } = useTheme();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const { token } = antTheme.useToken();

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    const userMenu: MenuProps['items'] = [
        {
            key: '1',
            label: 'Profile',
            icon: <UserOutlined />,
            onClick: () => router.push('/profile'),
        },
        {
            key: '2',
            label: 'Logout',
            icon: <LogoutOutlined />,
            danger: true,
            onClick: logout,
        },
    ];

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sidebar />
            <Layout>
                <Header style={{ padding: '0 24px', background: token.colorBgContainer, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        {mounted && (
                            <Button
                                type="text"
                                icon={theme === 'dark' ? <SunOutlined /> : <MoonOutlined />}
                                onClick={toggleTheme}
                                style={{ fontSize: '16px', width: 64, height: 64 }}
                            />
                        )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Dropdown menu={{ items: userMenu }} placement="bottomRight">
                            <Space style={{ cursor: 'pointer' }}>
                                <Avatar icon={<UserOutlined />} />
                                <span>{user?.email}</span>
                            </Space>
                        </Dropdown>
                    </div>
                </Header>
                <Content style={{ margin: '0 16px' }}>
                    <div
                        style={{
                            padding: 24,
                            minHeight: 360,
                            background: token.colorBgContainer, // Use token
                            marginTop: 16,
                            borderRadius: 8,
                        }}
                    >
                        {children}
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                    Ant Design ©{new Date().getFullYear()} Created by Xin Hao
                </Footer>
            </Layout>
        </Layout>
    );
}
