"use client";

import React, { useEffect, useState } from "react";
import {
    Layout,
    Button,
    Avatar,
    Dropdown,
    MenuProps,
    Space,
    theme as antTheme,
    Drawer,
    Grid,
    Menu,
    Card,
    Tag,
    Empty,
    Typography,
} from "antd";
import Sidebar from "@/components/Sidebar";
import {
    SunOutlined,
    MoonOutlined,
    LogoutOutlined,
    UserOutlined,
    MenuOutlined,
    PhoneOutlined,
    WhatsAppOutlined,
    SendOutlined,
    InstagramOutlined,
    FacebookOutlined,
    MailOutlined,
    CustomerServiceOutlined,
} from "@ant-design/icons";
import { useTheme } from "next-themes";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useMenuItems } from "@/components/menuItem";
import { motion } from "framer-motion";
import Modal from "antd/es/modal/Modal";
import { useData } from "@/context/DataContext";
import { CopyToClipboard } from "@/components/copyToClipboard";

const { Text } = Typography;

const { Header, Content, Footer } = Layout;
const { useBreakpoint } = Grid;

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const { theme, setTheme } = useTheme();
    const { hotlineList } = useData()
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const screens = useBreakpoint();
    const menuItems = useMenuItems();

    const isMobile = screens ? !screens.sm : false;

    const [drawerVisible, setDrawerVisible] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    const openModal = () => {
        setIsModalOpen(true);
    }

    const closeModal = () => {
        setIsModalOpen(false);
    }

    const userMenu: MenuProps["items"] = [
        {
            key: "1",
            label: "Profile",
            icon: <UserOutlined />,
            onClick: () => router.push("/profile"),
        },
        {
            key: "2",
            label: "Logout",
            icon: <LogoutOutlined />,
            danger: true,
            onClick: logout,
        },
    ];

    const formatPhoneMY = (phone: string) => {
        if (!phone) return "";
        return phone.startsWith("0") ? "6" + phone : phone;
    };

    const getSupportLink = (item: any) => {
        const { platform, phone, email, link } = item;

        switch (platform) {
            case "Whatsapp":
                return phone
                    ? `https://wa.me/${formatPhoneMY(phone).replace(/[^0-9]/g, "")}`
                    : null;

            case "Telegram":
                return link || (phone ? `https://t.me/${formatPhoneMY(phone).replace(/[^0-9]/g, "")}` : null);

            case "Instagram":
                return link || null;

            case "Facebook":
                return link || null;

            case "Teams":
                return link || (email ? `mailto:${email}` : null);

            default:
                return link;
        }
    };

    const getPlatformIcon = (platform: string) => {
        const style = { fontSize: 18 };

        switch (platform?.toLowerCase()) {
            case "whatsapp":
                return <WhatsAppOutlined style={{ ...style, color: "#25D366" }} />;

            case "telegram":
                return <SendOutlined style={{ ...style, color: "#229ED9" }} />;

            case "instagram":
                return <InstagramOutlined style={{ ...style, color: "#E4405F" }} />;

            case "facebook":
                return <FacebookOutlined style={{ ...style, color: "#1877F2" }} />;

            case "teams":
                return <MailOutlined size={18} color="#6264A7" />;

            case "email":
                return <MailOutlined style={{ ...style, color: "#fa8c16" }} />;

            case "phone":
                return <PhoneOutlined style={{ ...style, color: "#52c41a" }} />;

            default:
                return <CustomerServiceOutlined style={{ ...style, color: "#999" }} />;
        }
    };

    return (
        <Layout
            style={{ minHeight: "100vh", margin: 0, overflow: 'hidden' }}
            className={`login-wrapper ${theme === "dark" ? "dark" : ""}`}
        >
            <Sidebar />

            <Layout style={{ overflow: "hidden" }}>
                {/* Animated Background Blobs */}
                <div className="blob blob1" />
                <div className="blob blob2" />
                <div className="blob blob3" />
                <div className="blob blob4" />

                {/* Header */}
                <Header
                    style={{
                        padding: "0 24px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",

                        backdropFilter: "blur(12px)",
                        background: theme === "dark"
                            ? "rgba(30,30,30,0.3)"
                            : "rgba(255,255,255,0.3)",

                        borderBottom: "1px solid rgba(0,0,0,0.05)",

                        position: "sticky",
                        top: 0,
                        zIndex: 100,
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center" }}>
                        {isMobile && (
                            <>
                                <Button
                                    type="text"
                                    icon={<MenuOutlined />}
                                    onClick={() => setDrawerVisible(true)}
                                    style={{ marginRight: 12 }}
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
                                        onClick={() => setDrawerVisible(false)}
                                    />
                                </Drawer>
                            </>
                        )}

                        {mounted && (
                            <Button
                                type="text"
                                icon={theme === "dark" ? <SunOutlined /> : <MoonOutlined />}
                                onClick={toggleTheme}
                                style={{
                                    fontSize: 18,
                                    width: 40,
                                    height: 40,
                                    borderRadius: 10,
                                }}
                            />
                        )}
                    </div>

                    <Dropdown menu={{ items: userMenu }} placement="bottomRight">
                        <Space className="user-dropdown">
                            <Avatar icon={<UserOutlined />} />
                            <span>{user?.name}</span>
                        </Space>
                    </Dropdown>
                </Header>

                {/* Accent line */}
                <div className="header-accent" />

                {/* Content */}
                <Content style={{ margin: "10px", padding: 28, minHeight: 360, marginTop: 16, borderRadius: 16, backdropFilter: "blur(10px)", background: 'var(--ant-color-bg-container)', border: theme === "dark" ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(0,0,0,0.05)", boxShadow: "0 10px 40px rgba(0,0,0,0.08)" }}>
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {children}
                    </motion.div>
                </Content>
                <Footer style={{ textAlign: "center" }}>
                    Ant Design ©{new Date().getFullYear()} Created by Xin Hao
                </Footer>
            </Layout>


            {user?.role_label !== "superadmin" && <div
                style={{
                    position: "fixed",
                    right: 20,
                    bottom: 20,
                    width: 50,
                    height: 50,
                    zIndex: 999,
                }}
            >
                <Button
                    icon={<CustomerServiceOutlined />}
                    type="primary"
                    shape="circle"
                    style={{ width: "100%", height: "100%" }}
                    onClick={openModal}
                />
            </div>}

            <Modal
                title={
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontSize: 18, fontWeight: 600 }}>Support</span>
                        <span style={{ fontSize: 12, color: "#888" }}>
                            Contact us for assistance
                        </span>
                    </div>
                }
                open={isModalOpen}
                onCancel={closeModal}
                footer={null}
            >
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {hotlineList?.length ? (
                        hotlineList.filter((a: any) => a.status !== "Inactive").map((item: any) => {
                            const supportLink = getSupportLink(item);

                            return (
                                <Card
                                    key={item.id}
                                    size="small"
                                    hoverable
                                    style={{
                                        borderRadius: 14,
                                        border: "1px solid #f0f0f0",
                                        transition: "all 0.2s", padding: 5
                                    }}
                                >
                                    {/* HEADER */}
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 10,
                                            marginBottom: 10,
                                        }}
                                    >
                                        {getPlatformIcon(item.platform)}

                                        <Text strong style={{ fontSize: 15 }}>
                                            {item.platform}
                                        </Text>

                                        <Tag
                                            style={{ marginLeft: "auto" }}
                                            color={item.status === "Active" ? "green" : "default"}
                                        >
                                            {item.status}
                                        </Tag>
                                    </div>

                                    {/* PRIMARY ACTION */}
                                    {supportLink ? (
                                        <Button
                                            type="primary"
                                            block
                                            href={supportLink}
                                            target="_blank"
                                            style={{
                                                borderRadius: 8,
                                                fontWeight: 500,
                                            }}
                                        >
                                            Contact via {item.platform}
                                        </Button>
                                    ) : (
                                        <Text type="secondary">No direct link available</Text>
                                    )}

                                    {/* SECONDARY INFO */}
                                    <div
                                        style={{
                                            marginTop: 10,
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: 4,
                                            fontSize: 12,
                                            color: "#888",
                                        }}
                                    >
                                        {item.phone && <div>📞 <CopyToClipboard text={item.phone} /></div>}
                                        {item.email && <div>📧 <CopyToClipboard text={item.email} /></div>}
                                    </div>
                                </Card>
                            );
                        })
                    ) : (
                        <Empty description="No support available" />
                    )}
                </div>
            </Modal>

            <style jsx>{`
                    .login-wrapper {
                    position: relative;
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                    background: linear-gradient(135deg, #eef2ff, #f8fafc);
                    }

                    .login-wrapper.dark {
                    background: linear-gradient(135deg, #0f172a, #111827);
                    }

                    .user-dropdown {
                    cursor: pointer;
                    padding: 6px 10px;
                    border-radius: 12px;
                    transition: all 0.2s;
                    }

                    .user-dropdown:hover {
                    background: rgba(0, 0, 0, 0.05);
                    }

                    .dark .user-dropdown:hover {
                    background: rgba(255, 255, 255, 0.08);
                    }

                    .blob {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(120px);
                    opacity: 0.25;
                    // animation: float 20s infinite ease-in-out alternate;
                    z-index: 0;
                    overflow: hidden;
                    width: 100%;
                    height: 100%;
                    }

                    .blob1 {
                    width: 400px;
                    height: 400px;
                    background: #6366f1;
                    top: -100px;
                    left: -100px;
                    }

                    .blob2 {
                    width: 300px;
                    height: 300px;
                    background: #3b82f6;
                    top: 100px;
                    right: 100px;
                    }

                    .blob3 {
                    width: 300px;
                    height: 300px;
                    background: #8b5cf6;
                    top: 50px;
                    right: 20px;
                    }

                    .blob4 {
                    width: 400px;
                    height: 400px;
                    background: #6366f1;
                    bottom: 100px;
                    right: 100px;
                    }


                    .dark .blob {
                    opacity: 0.18;
                    }

                    @keyframes float {
                    0% {
                        transform: translateY(0px) translateX(0px);
                    }
                    100% {
                        transform: translateY(-40px) translateX(30px);
                    }
                    }

                    @media (max-width: 768px) {
                    .blob {
                        display: none;
                    }
                    }
                `}
            </style>
        </Layout>
    );
}