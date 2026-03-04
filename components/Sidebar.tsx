"use client";

import React, { useState, useEffect, useContext } from 'react';
import { Layout, Menu, theme, Button, Drawer, Grid, Typography } from 'antd';
import {
    HomeOutlined,
    UserOutlined,
    LogoutOutlined,
    SettingOutlined,
    TeamOutlined,
    MenuOutlined,
    VideoCameraOutlined,
    IdcardOutlined,
} from '@ant-design/icons';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import darkLogo from '@/public/assets/logo-light.png';
import logo from '@/public/assets/logo-dark.png';
import Image from 'next/image';
import { Header } from 'antd/es/layout/layout';
import { ThemeColorContext } from '@/app/providers';
import { useAuth } from '@/context/AuthContext';

const { Sider } = Layout;
const { useBreakpoint } = Grid;

const Sidebar: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [mounted, setMounted] = useState(false);

    const router = useRouter();
    const pathname = usePathname();
    const { theme: themeMode } = useTheme();
    const { token } = theme.useToken();
    const screens = useBreakpoint();
    const { logout } = useAuth();
    const colorContext = useContext(ThemeColorContext);
    const { primaryColor } = colorContext || { primaryColor: '#1677ff' };

    const { Title } = Typography;

    const menuItems = [
        { key: '/', icon: <HomeOutlined />, label: <Link href="/">Home</Link> },
        { key: '/profile', icon: <UserOutlined />, label: <Link href="/profile">Profile</Link> },
        { key: '/users', icon: <TeamOutlined />, label: <Link href="/users">Users</Link> },
        { key: '/role', icon: <IdcardOutlined />, label: <Link href="/role">Roles</Link> },
        { key: '/video', icon: <VideoCameraOutlined />, label: <Link href="/video">Video</Link> },
        { key: '/settings', icon: <SettingOutlined />, label: <Link href="/settings">Settings</Link> },
        { key: '/logout', icon: <LogoutOutlined />, label: 'Logout', danger: true, onClick: logout },
    ];

    // Detect mobile screen (safe now because hook order fixed)
    const isMobile = screens ? !screens.sm : false;

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null; // only affects rendering, hooks already called

    return (
        <>
            {isMobile ? (
                <>
                    <Button
                        type="primary"
                        icon={<MenuOutlined />}
                        onClick={() => setDrawerVisible(true)}
                        style={{ margin: 16 }}
                    />
                    <Drawer
                        title="Menu"
                        placement="left"
                        onClose={() => setDrawerVisible(false)}
                        open={drawerVisible}
                        styles={{ body: { padding: 0 } }}
                    >
                        <Menu
                            selectedKeys={[pathname]}
                            items={menuItems}
                            mode="inline"
                            style={{ borderRight: 0 }}
                            onClick={() => setDrawerVisible(false)} // auto close on click
                        />
                    </Drawer>
                </>
            ) : (
                <Sider
                    collapsible
                    collapsed={collapsed}
                    onCollapse={(value) => setCollapsed(value)}
                    style={{ background: token.colorBgContainer }}
                    theme={themeMode === 'dark' ? 'dark' : 'light'}
                >
                    <div
                        className="demo-logo-vertical"
                        style={{
                            height: 32,
                            margin: 10,
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                        }}
                    >
                        <Image
                            src={themeMode === 'dark' ? logo : darkLogo}
                            alt="Logo"
                            width={50}
                            height={50}
                            style={{ marginLeft: collapsed ? 5 : 0 }}
                        />
                        {!collapsed && (
                            <Title
                                level={4}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginTop: 10,
                                    fontWeight: 800,
                                    color: primaryColor,
                                }}
                            >
                                CCTV
                            </Title>
                        )}
                    </div>
                    <Menu
                        selectedKeys={[pathname]}
                        items={menuItems}
                        style={{ borderRight: 0 }}
                        inlineCollapsed={collapsed}
                        mode="inline"
                    />
                </Sider>
            )}
        </>
    );
};

export default Sidebar;