"use client";

import React, { useState } from 'react';
import {
    Card,
    Descriptions,
    Avatar,
    Typography,
    Button,
    Modal,
    Input,
    Select,
    Space,
    Tag,
    Switch,
    message,
    Form
} from 'antd';
import {
    UserOutlined,
    SafetyCertificateOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;


export default function ProfilePage() {
    const [form] = Form.useForm();
    const [modalOpen, setModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        name: "Admin User",
        username: "admin",
        email: "admin@example.com",
        role: "super_admin",
        status: true
    });

    const handleChange = (field: string, value: string | boolean) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = () => {
        console.log(formData)
    }

    return (
        <div style={{ padding: 24 }}>
            <Title level={2}>User Profile</Title>

            <Card styles={"glass-card"}>
                <div style={{
                    display: 'flex',
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 24
                }}>
                    <Space size="large">
                        <Avatar size={64} icon={<UserOutlined />} />
                        <div>
                            <Title level={4} style={{ margin: 0 }}>
                                {formData.name}
                            </Title>
                            <Text type="secondary">
                                {formData.role === "super_admin" ? "Super Admin" : "Administrator"}
                            </Text>
                        </div>
                    </Space>

                    <Button type="primary" onClick={() => setModalOpen(true)}>
                        Edit Profile
                    </Button>
                </div>

                <Descriptions title="Personal Information" bordered column={1}>
                    <Descriptions.Item label="Username">
                        {formData.username}
                    </Descriptions.Item>

                    <Descriptions.Item label="Email">
                        {formData.email}
                    </Descriptions.Item>

                    <Descriptions.Item label="Role">
                        <SafetyCertificateOutlined style={{ marginRight: 8 }} />
                        {formData.role === "super_admin" ? (
                            <Tag color="green">Super Admin</Tag>
                        ) : (
                            <Tag color="blue">Admin</Tag>
                        )}
                    </Descriptions.Item>

                    <Descriptions.Item label="Status">
                        {formData.status === true ? (
                            <Tag color="success">Active</Tag>
                        ) : (
                            <Tag color="error">Inactive</Tag>
                        )}
                    </Descriptions.Item>
                </Descriptions>
            </Card>

            <Modal
                title="Edit Profile"
                open={modalOpen}
                onCancel={() => setModalOpen(false)}
                onOk={() => form.submit()}
                okText="Save"
            >
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={formData}
                    onFinish={(values) => {
                        setFormData(values);
                        setModalOpen(false);
                        message.success("Profile updated successfully");
                    }}
                >
                    <Form.Item
                        label="Full Name"
                        name="name"
                        rules={[{ required: true, message: "Name is required" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: "Email is required" },
                            { type: "email", message: "Please enter a valid email address" }
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Role"
                        name="role"
                    >
                        <Select
                            options={[
                                { label: "Super Admin", value: "super_admin" },
                                { label: "Admin", value: "admin" }
                            ]}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Status"
                        name="status"
                        valuePropName="checked"
                    >
                        <Switch
                            checkedChildren="Active"
                            unCheckedChildren="Inactive"
                        />
                    </Form.Item>
                </Form>
            </Modal>

            <style jsx>{`

                .glass-card {
                    width: 100%;
                    max-width: 400px;
                    padding: 40px;
                    border-radius: 24px;
                    backdrop-filter: blur(20px);
                    background: rgba(255, 255, 255, 0.65);
                    box-shadow: 0 25px 60px rgba(0, 0, 0, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                }

                @media (max-width: 768px) {
                    .glass-card {
                        padding: 30px;
                    }
                }
            `}</style>
        </div>
    );
}