import { HomeOutlined, UserOutlined, TeamOutlined, IdcardOutlined, SafetyCertificateOutlined, LogoutOutlined, CrownOutlined, FileTextOutlined, CustomerServiceOutlined, GlobalOutlined, MonitorOutlined, HistoryOutlined, PhoneOutlined, SettingFilled, PieChartOutlined, CameraOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Grid } from "antd";
import { useAbility } from "@/context/AbilityContext";

const { useBreakpoint } = Grid;

export const useMenuItems = () => {
    const { logout } = useAuth();
    const screens = useBreakpoint();
    const isMobile = screens ? !screens.sm : false;
    const { abilityFor } = useAbility();

    const { canRead: canReadTenant } = abilityFor("tenant");
    const { canRead: canReadNotification } = abilityFor("notification");
    const { canRead: canReadAi } = abilityFor("ai");
    const { canRead: canReadVideo } = abilityFor("video");
    const { canRead: canReadPermissiongroup } = abilityFor("permissiongroups");
    const { canRead: canReadRole, canCreate: canCreateRole } = abilityFor("roles");
    const { canRead: canReadUser } = abilityFor("user");
    const { canRead: canReadEmployee } = abilityFor("employee");
    const { canRead: canReadGroup } = abilityFor("groups");
    const { canRead: canReadCamera } = abilityFor("camera");

    const settingPermissions =
        canReadUser ||
        (canReadRole && canCreateRole) ||
        canReadPermissiongroup ||
        canReadNotification ||
        canReadAi ||
        canReadVideo;


    const menuItems = [
        {
            key: "/",
            icon: <HomeOutlined />,
            label: <Link href="/">Dashboard</Link>,
        }, canReadCamera && {
            key: "/video",
            icon: <CameraOutlined />,
            label: <Link href="/video">Video</Link>,
        },
        settingPermissions && {
            key: "system",
            icon: <SettingFilled />,
            label: "System",
            children: [
                canReadUser && {
                    key: "/users",
                    icon: <UserOutlined />,
                    label: <Link href="/users">User</Link>,
                },
                canReadEmployee && {
                    key: "/employees",
                    icon: <UserOutlined />,
                    label: <Link href="/employees">Employee</Link>,
                },
                canCreateRole && {
                    key: "/role",
                    icon: <IdcardOutlined />,
                    label: <Link href="/role">Roles</Link>,
                },
                canReadPermissiongroup && {
                    key: "/permissionGroups",
                    icon: <SafetyCertificateOutlined />,
                    label: <Link href="/permissionGroups">Permission</Link>,
                },
            ],
        },
    ];
    return menuItems;
};