import { Result, Button } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

const LoadingPage = () => {
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
                icon={<LoadingOutlined style={{ color: '#1677ff' }} spin />}
            />
        </div>
    );
};

export default LoadingPage;