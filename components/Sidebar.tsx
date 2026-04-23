"use client";

import React, { useState, useEffect, useContext } from 'react';
import { Layout, Menu, theme, Button, Drawer, Grid, Typography } from 'antd';
import { useRouter, usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import darkLogo from '@/public/assets/logo-light.png';
import logo from '@/public/assets/logo-dark.png';
import Image from 'next/image';
import { ThemeColorContext } from '@/app/providers';
import { useAuth } from '@/context/AuthContext';
import { useMenuItems } from './menuItem';
import { motion } from "framer-motion";

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
    const menuItems = useMenuItems();


    const { Title } = Typography;

    const isMobile = screens ? !screens.sm : false;

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <>
            {!isMobile && (
                <Sider
                    collapsible
                    collapsed={collapsed}
                    onCollapse={(value) => setCollapsed(value)}
                    style={{
                        position: "sticky",
                        top: 0,
                        zIndex: 100,
                        background: themeMode === "dark"
                            ? "rgba(30,30,30,0.3)"
                            : "rgba(255,255,255,0.3)",
                    }}
                    theme={themeMode === 'dark' ? 'dark' : 'light'}
                >
                    <div className={`menu-wrapper ${collapsed ? "collapsed" : "expanded"}`}>

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
                                width={40}
                                height={40}
                                style={{
                                    marginLeft: collapsed ? 10 : 5, paddingRight: collapsed ? 0 : 5, objectFit: "contain"
                                }}
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
                                    TrueSight
                                </Title>
                            )}
                        </div>
                    </div>
                    <div className={`menu-wrapper ${collapsed ? "collapsed" : "expanded"}`}>
                        <Menu
                            selectedKeys={[pathname]}
                            items={menuItems}
                            style={{
                                borderRight: 0,
                                backgroundColor: "transparent"
                            }}
                            inlineCollapsed={collapsed}
                            mode="inline"
                        />
                    </div>
                </Sider>
            )}

            <style jsx>{`
             .menu-wrapper {
                    transition: all 0.9s ease;
                }

                .menu-wrapper.expanded {
                    opacity: 1;
                    transform: translateX(0);
                }

                .menu-wrapper.collapsed {
                    opacity: 0.8;
                    transform: translateX(-5px);
                }
            `}</style>
        </>
    );
};

export default Sidebar;