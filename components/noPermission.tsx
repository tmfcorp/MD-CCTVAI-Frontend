import { Result, Button } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

interface NoPermissionProps {
    message?: string;
}

const NoPermission = ({ message }: NoPermissionProps) => {
    const router = useRouter();

    return (
        <div
            style={{
                minHeight: "70vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Result
                icon={<LockOutlined style={{ color: "#ff4d4f" }} />}
                title="Access Denied"
                subTitle={
                    message || "You do not have permission to view this page."
                }
                extra={[
                    <Button type="primary" key="dashboard" onClick={() => router.push("/")}>
                        Go Dashboard
                    </Button>
                ]}
            />
        </div>
    );
};

export default NoPermission;