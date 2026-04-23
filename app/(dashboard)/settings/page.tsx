"use client";

import React, { useContext, useEffect, useState } from 'react';
import { Card, Radio, Typography, Space, theme as antTheme, ColorPicker, Button } from 'antd';
import { useTheme } from 'next-themes';
import { MoonOutlined, SunOutlined, DesktopOutlined } from '@ant-design/icons';
import { ThemeColorContext } from '../../providers';

const { Title, Text } = Typography;

const SettingsPage: React.FC = () => {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const colorContext = useContext(ThemeColorContext);
    const { primaryColor, setPrimaryColor } = colorContext || { primaryColor: '#1677ff', setPrimaryColor: () => { } };

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
            <Title level={2}>Settings</Title>

            <Card title="Appearance" style={{ marginTop: 24 }}>
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    <div>
                        <Text strong>Theme Preference</Text>
                        <div style={{ marginTop: 12 }}>
                            <Radio.Group
                                value={theme}
                                onChange={(e) => setTheme(e.target.value)}
                                buttonStyle="solid"
                                size="large"
                            >
                                <Radio.Button value="light">
                                    <Space>
                                        <SunOutlined />
                                        Light
                                    </Space>
                                </Radio.Button>
                                <Radio.Button value="dark">
                                    <Space>
                                        <MoonOutlined />
                                        Dark
                                    </Space>
                                </Radio.Button>

                            </Radio.Group>
                        </div>
                        <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
                            Customize how the application looks properly on your device.
                        </Text>
                    </div>

                    <div style={{ display: "flex" }}>
                        <Text strong>Brand Color</Text>
                        <div style={{ marginTop: 12 }}>
                            <ColorPicker
                                showText
                                value={primaryColor}
                                onChangeComplete={(color) => setPrimaryColor(color.toHexString())}
                            />
                        </div>
                        <Button onClick={() => setPrimaryColor("#1677ff")}>
                            <Text>Default Color</Text>
                        </Button>
                        <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
                            Choose a primary color for buttons, links, and other interactive elements.
                        </Text>
                    </div>
                </Space>
            </Card>
        </div >
    );
};

export default SettingsPage;
