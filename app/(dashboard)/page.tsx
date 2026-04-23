"use client";

import React from "react";
import { Card, Col, Row, Typography, Tag, List, Table } from "antd";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const { Title, Text } = Typography;

const kpiData = [
  {
    title: "Active Cameras",
    value: 128,
    color: "#22c55e", // green (healthy / active)
    bg: "rgba(34,197,94,0.12)",
  },
  {
    title: "Offline Cameras",
    value: 6,
    color: "#ef4444", // red (problem)
    bg: "rgba(239,68,68,0.12)",
  },
  {
    title: "Alerts Today",
    value: 23,
    color: "#f59e0b", // amber (warning)
    bg: "rgba(245,158,11,0.12)",
  },
  {
    title: "Storage Usage",
    value: "68%",
    color: "#6366f1", // your secondary
    bg: "rgba(99,102,241,0.12)",
  },
];
const activityData = [
  { time: "00:00", detections: 12 },
  { time: "04:00", detections: 8 },
  { time: "08:00", detections: 25 },
  { time: "12:00", detections: 40 },
  { time: "16:00", detections: 30 },
  { time: "20:00", detections: 22 },
];

const alertTypeData = [
  { name: "Motion", value: 40 },
  { name: "Face", value: 25 },
  { name: "Intrusion", value: 15 },
  { name: "Other", value: 20 },
];

const cameraStatusData = [
  { name: "Online", value: 128 },
  { name: "Offline", value: 6 },
];

const alerts = [
  { title: "Motion detected at Lobby", status: "warning" },
  { title: "Camera #12 offline", status: "error" },
  { title: "Face detected (VIP)", status: "success" },
];

const columns = [
  {
    title: "Title",
    dataIndex: "title",
  },
  {
    title: "Status",
    dataIndex: "status",
    render: (status: any) => <Tag color={status}>{status}</Tag>,
  },
];

const COLORS = ["#3b82f6", "#6366f1", "#22c55e", "#f59e0b"];

export default function Home() {
  return (
    <div>
      <Title level={3}>Dashboard</Title>

      {/* KPI */}
      <Row gutter={[16, 16]}>
        {kpiData.map((item, index) => (
          <Col xs={24} sm={12} md={6} key={index}>
            <Card
              style={{
                background: item.bg,
                borderRadius: 16,
              }}
            >
              <Text type="secondary">{item.title}</Text>

              <Title
                level={3}
                style={{
                  margin: 0,
                  color: item.color,
                }}
              >
                {item.value}
              </Title>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Charts */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        {/* Line Chart */}
        <Col xs={24} lg={12}>
          <Card title="Detection Activity">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={activityData}>
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="detections"
                  stroke="#3b82f6"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Bar Chart */}
        <Col xs={24} lg={12}>
          <Card title="Alert Types">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={alertTypeData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value">
                  {alertTypeData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Pie + Alerts */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        {/* Pie Chart */}
        <Col xs={24} lg={12}>
          <Card title="Camera Status">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={cameraStatusData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label
                >
                  {cameraStatusData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Alerts */}
        <Col xs={24} lg={12}>
          <Card title="Recent Alerts">
            <Table
              rowKey="id"
              columns={columns}
              dataSource={alerts}
              pagination={false}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}