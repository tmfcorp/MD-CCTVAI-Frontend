import React, { useState, useCallback } from "react";
import { theme, App, Tooltip } from "antd";

interface CopyProps {
    text: string;
}

export const CopyToClipboard: React.FC<CopyProps> = ({ text }) => {
    const { message } = App.useApp();
    const [hover, setHover] = useState(false);
    const { token } = theme.useToken();

    const handleCopy = useCallback(() => {
        const textArea = document.createElement("textarea");
        textArea.value = text;

        textArea.style.position = "fixed";
        textArea.style.opacity = "0";

        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            const successful = document.execCommand("copy");
            if (successful) {
                message.success("Copied to clipboard");
            } else {
                message.error("Copy failed");
            }
        } catch {
            message.error("Copy failed");
        }

        document.body.removeChild(textArea);
    }, [text, message]);

    return (
        <Tooltip title="Click to copy">
            <span
                style={{
                    cursor: "pointer",
                    color: hover ? token.colorPrimary : "inherit",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    transition: "color 0.2s",
                }}
                onClick={handleCopy}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
            >
                {text}
            </span>
        </Tooltip>
    );
};