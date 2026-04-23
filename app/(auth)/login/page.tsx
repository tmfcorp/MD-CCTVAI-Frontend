"use client";

import React, { useEffect, useState } from "react";
import { Button, Checkbox, Form, Input, Typography, message } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useAuth } from "@/context/AuthContext";
import darkLogo from '@/public/assets/logo-light.png';
import Image from "next/image";
import useToken from "antd/es/theme/useToken";



const { Title, Text } = Typography;

export default function LoginPage() {
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const { token } = useToken();

  const isDark = resolvedTheme === "dark";

  const { login } = useAuth();

  useEffect(() => {
    form.setFieldsValue({
      email: "superadmin@tmfcorp.limited",
      password: "123",
    });
  }, [form]);

  const onFinish = async (values: any) => {
    setLoading(true);

    try {
      const res = await login(values);

      if (res.success) {
        router.push("/");
      }
    } catch (err) {
      message.error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  const containerStyle = {
    padding: 20,
    borderRadius: 16,
    background: isDark
      ? "rgba(17, 25, 40, 0.75)"
      : "rgba(255, 255, 255, 0.8)",
    backdropFilter: "blur(20px)",
    border: isDark
      ? "1px solid rgba(255,255,255,0.08)"
      : "1px solid rgba(0,0,0,0.05)",
    boxShadow: isDark
      ? "0 10px 40px rgba(0,0,0,0.6)"
      : "0 10px 40px rgba(0,0,0,0.08)",
    transition: "all 0.3s ease",
    maxWidth: "50vh",
    minWidth: "400px",
    width: "40%"
  };

  return (
    <div className={`login-wrapper ${isDark ? "dark" : ""}`}>
      {/* Animated Blobs */}
      <div className="blob blob1" />
      <div className="blob blob2" />
      <div className="blob blob3" />
      <div className="blob blob4" />

      <motion.div
        className="login-container"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={containerStyle}
      >
        {/* Left Enterprise Text */}
        <motion.div
          className="login-left"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            {/* Logo + Title */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 5,
              }}
            >
              <Image
                src={darkLogo}
                alt="Logo"
                width={44}
                height={44}
                style={{ display: "block" }}
              />

              <Title
                level={2}
                className="brand-title"
                style={{
                  margin: 0,
                  lineHeight: 1.2,
                  color: "#3b82f6"
                }}
              >
                TrueSight
              </Title>
            </div>
            <Text className="brand-subtitle" type="secondary" style={{ textAlign: "center", marginBottom: 10 }}>
              AI-Powered Video Analytics Platform
            </Text>
            {/* Subtitle Group */}
          </div>
        </motion.div>

        {/* Glass Login Card */}
        <motion.div
          className="glass-card"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Title level={3} style={{ marginBottom: 8 }}>
            Sign In
          </Title>
          <Text type="secondary">
            Access your secure workspace
          </Text>

          <Form
            form={form}
            layout="vertical"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            style={{ marginTop: 24 }}
          >
            <Form.Item
              name="email"
              rules={[{ required: true, message: "Please enter username" }]}
            >
              <Input
                size="large"
                prefix={<UserOutlined />}
                placeholder="Username"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: "Please enter password" }]}
            >
              <Input.Password
                size="large"
                prefix={<LockOutlined />}
                placeholder="Password"
              />
            </Form.Item>

            <div className="login-options">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
            </div>

            <Form.Item style={{ marginTop: 24 }}>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={loading}
                className="login-button"
              >
                Log In
              </Button>
            </Form.Item>

            {/* <div style={{ textAlign: "center" }}>
              <Text type="secondary">
                No account? <Link href="/register">Create one</Link>
              </Text>
            </div> */}
          </Form>
        </motion.div>
      </motion.div>

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

        .login-container {
          position: relative;
          z-index: 2;
          display: flex;
          width: 100%;
          max-width: 1100px;
          padding: 40px;
          gap: 60px;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          background: linear-gradient(135deg, #eef2ff, #f8fafc);

        }

        .login-left {
          flex: 1;
          min-width: 280px;
        }

        .brand-title {
          font-size: 36px;
          font-weight: 700;
        }

        .brand-subtitle {
          font-size: 16px;
          opacity: 0.8;
        }

.glass-card {
  position: relative;
  overflow: hidden;
}

.glass-card::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 24px;
  background: radial-gradient(
    circle at top left,
    rgba(255, 106, 0, 0.15),
    transparent 60%
  );
  pointer-events: none;
}

        .dark .glass-card {
          background: rgba(17, 25, 40, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .login-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .login-button {
          height: 48px;
          border-radius: 12px;
          font-weight: 600;
          background: linear-gradient(135deg, #ff6a00, #ff8c00);
          border: none;
          box-shadow: 0 0 12px rgba(255, 106, 0, 0.6),
                      0 0 30px rgba(255, 106, 0, 0.3);
          transition: all 0.25s ease;
        }

        .login-button:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 0 20px rgba(255, 106, 0, 0.9),
                      0 0 50px rgba(255, 106, 0, 0.5);
        }

        /* Animated Blobs */
        .blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(180px);
          opacity: 0.6;
          animation: float 20s infinite ease-in-out alternate;
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
          bottom: 80px;
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
          bottom: 50px;
          right: 20px;
        }

        @keyframes float {
          0% {
            transform: translateY(0px) translateX(0px);
          }
          100% {
            transform: translateY(-40px) translateX(30px);
          }
        }

        /* Mobile */
        @media (max-width: 768px) {
          .login-container {
            flex-direction: column;
            text-align: center;
            padding: 20px;
          }

          .glass-card {
            width: 100%;
            padding: 30px;
          }
        }
      `}</style>
    </div>
  );
}