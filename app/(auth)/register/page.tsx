"use client";

import React, { useState } from 'react';
import { Button, Form, Input, Card, message } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const onFinish = (values: any) => {
        setLoading(true);
        console.log('Received values of form: ', values);

        setTimeout(() => {
            message.success('Registration successful! Please login.');
            setLoading(false);
            router.push('/login');
        }, 1000);
    };

    return (
        <div className="register-wrapper">
            <Card title="Register" className="glass-card">
                <Form
                    name="register"
                    initialValues={{ username: '', email: '', password: '', confirm: '' }}
                    onFinish={onFinish}
                    layout="vertical"
                >
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: 'Please input your Username!' }]}
                    >
                        <Input prefix={<UserOutlined />} placeholder="Username" />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        rules={[
                            { required: true, message: 'Please input your Email!' },
                            { type: 'email', message: 'The input is not valid E-mail!' }
                        ]}
                    >
                        <Input prefix={<MailOutlined />} placeholder="Email" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please input your Password!' }]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Password"
                        />
                    </Form.Item>

                    <Form.Item
                        name="confirm"
                        dependencies={['password']}
                        hasFeedback
                        rules={[
                            { required: true, message: 'Please confirm your password!' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Passwords do not match!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Confirm Password"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block loading={loading}>
                            Register
                        </Button>
                        <div style={{ textAlign: 'center', marginTop: 10 }}>
                            Or <Link href="/login">login now!</Link>
                        </div>
                    </Form.Item>
                </Form>
            </Card>

            <style jsx>{`
                .register-wrapper {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    background: linear-gradient(135deg, #eef2ff, #f8fafc);
                    padding: 16px;
                }

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