"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
    Typography,
    Menu,
    Grid,
    Pagination,
    Dropdown,
    Avatar,
    Space,
    MenuProps,
    theme,
    Input,
} from "antd";
import {
    VideoCameraOutlined,
    MoreOutlined,
    DoubleLeftOutlined,
    DoubleRightOutlined,
} from "@ant-design/icons";
import { useTheme } from "next-themes";

const { Text } = Typography;
const { useBreakpoint } = Grid;

interface CameraInfo {
    id: string;
    name: string;
    online: boolean;
}

const availableCameras: CameraInfo[] = Array.from({ length: 20 }, (_, i) => ({
    id: `cam${i + 1}`,
    name: `CCTV-${i + 1}`,
    online: Math.random() < 0.8,
}));

export default function VideoPage() {
    const { theme: themeMode } = useTheme();
    const { token } = theme.useToken();
    const screens = useBreakpoint();
    const isMobile = !screens.md;

    const [mounted, setMounted] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const [fullscreenCam, setFullscreenCam] = useState<string | null>(null);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [currentPage, setCurrentPage] = useState(1);
    const [cameraOrder, setCameraOrder] = useState<string[]>(availableCameras.map(c => c.id));
    const [selectedCameraIds, setSelectedCameraIds] = useState<string[]>(availableCameras.map(c => c.id));
    const [searchTerm, setSearchTerm] = useState("");
    const [layoutMode, setLayoutMode] = useState<"auto" | "manual">("manual");
    const [manualColumns, setManualColumns] = useState<number>(3);

    useEffect(() => {
        setMounted(true);
        const interval = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        localStorage.setItem("cctv-layout-mode", layoutMode);
        if (layoutMode === "manual") localStorage.setItem("cctv-manual-columns", String(manualColumns));
    }, [layoutMode, manualColumns]);

    useEffect(() => {
        if (screens.md) setCollapsed(true);
    }, [screens]);

    const feedsPerPage =
        layoutMode === "manual" && manualColumns
            ? manualColumns ** 2
            : screens.xl || screens.lg
                ? 3 ** 2
                : screens.md
                    ? 2 ** 2
                    : 1;

    const orderedCameras = cameraOrder
        .map(id => availableCameras.find(cam => cam.id === id))
        .filter(Boolean) as CameraInfo[];

    const filteredCameras = searchTerm
        ? orderedCameras.filter(cam =>
            cam.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : orderedCameras.filter(cam =>
            selectedCameraIds.includes(cam.id)
        );

    const paginatedCameras = fullscreenCam
        ? filteredCameras.filter(c => c.id === fullscreenCam)
        : filteredCameras.slice(
            (currentPage - 1) * feedsPerPage,
            currentPage * feedsPerPage
        );


    const handleDrag = (e: React.DragEvent, id: string) => e.dataTransfer.setData("drag-id", id);
    const handleDrop = (e: React.DragEvent, targetId: string) => {
        const draggedId = e.dataTransfer.getData("drag-id");
        if (!draggedId || draggedId === targetId) return;
        const newOrder = [...cameraOrder];
        const from = newOrder.indexOf(draggedId);
        const to = newOrder.indexOf(targetId);
        newOrder.splice(from, 1);
        newOrder.splice(to, 0, draggedId);
        setCameraOrder(newOrder);
    };

    if (!mounted) return null;

    const layoutItems: MenuProps["items"] = [3, 2, 1].map(num => ({
        key: num.toString(),
        label: `${num}x${num}`,
        onClick: () => {
            setLayoutMode("manual");
            setManualColumns(num);
        },
        style: {
            padding: "6px 12px",
            cursor: "pointer",
            borderRadius: 4,
            border: manualColumns === num ? `2px solid ${token.colorPrimary}` : "1px solid #555",
            background: manualColumns === num ? "#e6f7ff" : "#222",
            color: manualColumns === num ? token.colorPrimary : "#e6f7ff",
            fontWeight: 600,
            textAlign: "center",
            userSelect: "none",
            transition: "all 0.2s",
        },
    }));

    const columns = fullscreenCam
        ? 1
        : layoutMode === "manual"
            ? manualColumns
            : screens.xl || screens.lg
                ? Math.min(paginatedCameras.length, 3)
                : screens.md
                    ? Math.min(paginatedCameras.length, 2)
                    : 1;
    const flexBasis = `${100 / columns}%`;

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "stretch" }}>
            {/* Top Bar */}
            {!fullscreenCam && <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <Input
                    placeholder="Search cameras"
                    allowClear
                    onChange={e => setSearchTerm(e.target.value)}
                    style={{ margin: "12px 12px 12px 0" }}
                />
                {!isMobile && (
                    <Dropdown menu={{ items: layoutItems }} placement="bottomRight">
                        <Space style={{ cursor: "pointer" }}>
                            <span>Layout</span>
                            <Avatar icon={<MoreOutlined />} />
                        </Space>
                    </Dropdown>
                )}
            </div>}

            <div
                style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "row",
                    overflow: "hidden",
                }}
            >
                {/* Sidebar */}
                {!fullscreenCam && !isMobile && (
                    <div
                        style={{
                            display: "flex",
                            height: "80vh",
                            alignItems: "stretch",
                        }}
                    >
                        <div
                            style={{
                                width: collapsed ? 90 : 200,
                                minWidth: collapsed ? 80 : 200,
                                flexShrink: 0,
                                display: "flex",
                                flexDirection: "column",
                                overflowY: "auto",
                                overflowX: "hidden",
                                transition: "all 0.5s",
                                height: "100%",
                            }}
                        >
                            {/* Header */}
                            <div style={{
                                height: 50,
                                minHeight: 50,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: collapsed ? "center" : "space-between",
                                padding: collapsed ? "20px" : "0 18px",
                            }}>
                                {collapsed ? <DoubleLeftOutlined
                                    onClick={() => setCollapsed(!collapsed)}
                                    style={{ color: "#8c8c8c", fontSize: 18, cursor: "pointer" }}
                                /> : <DoubleRightOutlined
                                    onClick={() => setCollapsed(!collapsed)}
                                    style={{ color: "#8c8c8c", fontSize: 18, cursor: "pointer" }}
                                />}
                                {!collapsed && <Text style={{ fontWeight: 600 }}>CAMERAS</Text>}
                            </div>

                            {/* Camera Menu */}
                            <div style={{ flex: 1, overflow: "none" }}>
                                <Menu
                                    theme={themeMode !== "dark" ? "light" : "dark"}
                                    mode="vertical"
                                    selectedKeys={selectedCameraIds}
                                    onSelect={({ key }) => {
                                        if (!selectedCameraIds.includes(key)) {
                                            setSelectedCameraIds([...selectedCameraIds, key]);
                                        }
                                    }}
                                    onDeselect={({ key }) =>
                                        setSelectedCameraIds(selectedCameraIds.filter((id) => id !== key))
                                    }
                                    multiple
                                    inlineCollapsed={collapsed}
                                    style={{ background: "transparent", borderRight: 0 }}
                                >
                                    {availableCameras.map((cam) => (
                                        <Menu.Item
                                            key={cam.id}
                                            icon={
                                                <div style={{
                                                    position: "relative",
                                                }}
                                                >
                                                    <VideoCameraOutlined />
                                                    <span
                                                        style={{
                                                            position: "absolute",
                                                            right: -2,
                                                            top: -2,
                                                            width: 6,
                                                            height: 6,
                                                            borderRadius: "50%",
                                                            background: cam.online ? "#00ff88" : "#ff3b30",
                                                        }}
                                                    />
                                                </div>
                                            }
                                        >
                                            {cam.name}
                                        </Menu.Item>
                                    ))}
                                </Menu>
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Grid */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", height: isMobile ? "100vh" : "auto", alignItems: "stretch", }}>
                    <div style={{ display: "flex", flexWrap: "wrap", overflowY: "auto" }}>
                        {paginatedCameras.length === 0 ? (
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "rgba(255,255,255,0.3)",
                                    fontSize: 16,
                                    padding: 40,
                                    textAlign: "center",
                                    gap: 12,
                                    width: "100%",
                                    height: "100%",
                                    background: "black",
                                    aspectRatio: "16/9",
                                    maxWidth: `90vw`
                                }}
                            >
                                <VideoCameraOutlined style={{ fontSize: 48 }} />
                                <div style={{ fontWeight: 500 }}>No Video Feed</div>
                                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>
                                    Select a camera from the sidebar to start viewing
                                </div>
                            </div>
                        ) : (
                            (() => {
                                const feedCount = paginatedCameras.length;

                                let columns = fullscreenCam ? 1 : filteredCameras;

                                if (fullscreenCam) {
                                    columns = 1;
                                } else if (screens.lg) {
                                    columns = Math.min(feedCount, 3);
                                } else if (screens.md) {
                                    columns = Math.min(feedCount, 2);
                                } else {
                                    columns = 1;
                                }

                                const flexBasis =
                                    !isMobile && manualColumns === 2
                                        ? "50%"
                                        : `${100 / columns}%`;

                                return paginatedCameras.map((cam) => (
                                    <div
                                        key={cam.id}
                                        draggable={!fullscreenCam}
                                        onDragStart={(e) => handleDrag(e, cam.id)}
                                        onDragOver={(e) => e.preventDefault()}
                                        onDrop={(e) => handleDrop(e, cam.id)}
                                        onDoubleClick={() =>
                                            setFullscreenCam(fullscreenCam === cam.id ? null : cam.id)
                                        }
                                        style={{
                                            flex: `1 1 ${flexBasis}`,
                                            background: "#000",
                                            border: `${searchTerm &&
                                                cam.name.toLowerCase() === searchTerm.toLowerCase() ? "3px" : cam.name.toLowerCase().includes(searchTerm.toLowerCase())
                                                ? "2px"
                                                : "1px"
                                                } solid ${cam.name.toLowerCase() === searchTerm.toLowerCase() ? `${token.colorPrimary}` : searchTerm &&
                                                    cam.name.toLowerCase().includes(searchTerm.toLowerCase())
                                                    ? `${token.colorPrimary}50`
                                                    : "#2a2f3a"
                                                }`,
                                            borderRadius: 4,
                                            overflow: "hidden",
                                            position: "relative",
                                            aspectRatio: "16/9",
                                            cursor: "pointer",
                                            transition: "all 0.3s ease",
                                            maxWidth: `80vw`,
                                            maxHeight: `80vh`

                                        }}
                                    >
                                        {/* Header */}
                                        <div
                                            style={{
                                                position: "absolute",
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                padding: "6px 10px",
                                                background:
                                                    "linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)",
                                                display: "flex",
                                                justifyContent: "space-between",
                                                fontSize: 12,
                                            }}
                                        >
                                            <Text style={{ color: "#fff" }}>{cam.name}</Text>
                                            <div style={{ display: "flex", gap: 6 }}>
                                                <div
                                                    style={{
                                                        width: 8,
                                                        height: 8,
                                                        borderRadius: "50%",
                                                        background: "#ff3b30",
                                                        boxShadow: "0 0 6px #ff3b30",
                                                    }}
                                                />
                                                <Text style={{ color: "#fff" }}>REC</Text>
                                            </div>
                                        </div>

                                        {/* Body */}
                                        <div
                                            style={{
                                                height: "100%",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                color: "rgba(255,255,255,0.2)",
                                                fontSize: 40,
                                            }}
                                        >
                                            <VideoCameraOutlined />
                                        </div>

                                        {/* Footer */}
                                        <div
                                            style={{
                                                position: "absolute",
                                                bottom: 0,
                                                left: 0,
                                                right: 0,
                                                padding: "6px 10px",
                                                background:
                                                    "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
                                                fontSize: 11,
                                                color: "#ccc",
                                                display: "flex",
                                                justifyContent: "space-between",
                                            }}
                                        >
                                            <span>{currentTime.toLocaleTimeString()}</span>
                                            <span>1080P</span>
                                        </div>
                                    </div>
                                ));
                            })()
                        )}
                    </div>

                    {/* Pagination */}
                    {!fullscreenCam && filteredCameras.length > feedsPerPage && (
                        <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end" }}>
                            <Pagination
                                current={currentPage}
                                onChange={page => setCurrentPage(page)}
                                total={filteredCameras.length}
                                pageSize={feedsPerPage}
                                showSizeChanger={false}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div >
    );
}