import React from "react";

type ShimmerProps = {
    width?: string | number;
    height?: string | number;
    borderRadius?: string | number;
    style?: React.CSSProperties;
    className?: string;
};

const Shimmer: React.FC<ShimmerProps> = ({
    width = "100%",
    height = 16,
    borderRadius = 8,
    style = {},
    className = "",
}) => {
    return (
        <> <div
            className={`shimmer ${className}`}
            style={{
                width,
                height,
                borderRadius,
                ...style,
            }}
        />
            <style jsx>{`
            .shimmer {
                background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                background-size: 200% 100%;
                animation: shimmer 1.5s infinite;
            }

            @keyframes shimmer {
                0% {
                    background-position: 200% 0;
                }
                100% {
                    background-position: -200% 0;
                }
            }
        `}</style>
        </>

    );
};

export default Shimmer;