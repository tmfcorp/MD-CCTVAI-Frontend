"use client";

import React, { useEffect, useRef, useState } from 'react';
import {
    Table,
    Button,
    Modal,
    Form,
    Input,
    Switch,
    Upload,
    Avatar,
    Space,
    Tag,
    Popconfirm,
    Typography,
    App,
    Select,
    Empty,
} from 'antd';
import Icon, {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    UserOutlined,
    SearchOutlined
} from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import type { TablePaginationConfig } from "antd";
import { useData } from '@/context/DataContext';
import { useAbility } from '@/context/AbilityContext';
import { ColumnsType } from 'antd/es/table';
import { buildCacheKey } from '@/components/cacheKey';
import NoPermission from '@/components/noPermission';
import { CopyToClipboard } from '@/components/copyToClipboard';
import LoadingPage from '@/components/loadingPage';

const { Title, Text } = Typography;


interface User {
    id: string;
    email: string;
    name: string;
    role_id: string;
    role_label: string;
    status: string;
    password?: string;
}

export default function UsersPage() {
    const { message } = App.useApp();
    const { userList, userLoading, editUser, addUser, deleteUser, roleList, getUserList, userTotal } = useData();
    const { abilityFor } = useAbility();
    const {
        canRead,
        canCreate,
        canUpdate,
        canDelete,
    } = abilityFor("users");
    const [search, setSearch] = useState<string>();
    const [loading, setLoading] = useState<boolean>(false);
    const [submitLoading, setSubmitLoading] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [form] = Form.useForm();
    const [pagination, setPagination] = useState<TablePaginationConfig>({
        current: 1,
        pageSize: 10,
    });
    const userCache = useRef<
        Record<string, { data: User[]; total: number }>
    >({});


    const handleTableChange = async (
        newPagination: TablePaginationConfig,
        _filter: any,
        sorter: any
    ) => {
        setLoading(true)

        const isPageSizeChanged = newPagination.pageSize !== pagination.pageSize;
        const currentPage = isPageSizeChanged ? 1 : newPagination.current!;

        setPagination({
            current: currentPage,
            pageSize: newPagination.pageSize!,
        });

        const sortField = sorter?.field;
        const sortOrder = sorter?.order;

        const order =
            sortOrder === "ascend"
                ? "asc"
                : sortOrder === "descend"
                    ? "desc"
                    : undefined;

        const finalSortField = order ? sortField : undefined;

        const cacheKey = buildCacheKey(
            "user",
            currentPage,
            newPagination.pageSize!,
            search,
            sortField,
            sortOrder
        );

        try {
            const res: any = await getUserList({
                page: currentPage,
                pageSize: newPagination.pageSize!,
                search,
                sortField: finalSortField,
                sortOrder: order,
            });

            if (res?.data) {
                userCache.current[cacheKey] = {
                    data: res.data.data,
                    total: res.data.total,
                };
            }
        } finally {
            setLoading(false);
        }

    };

    const prevSearchRef = useRef<string | undefined>(undefined);

    useEffect(() => {
        if (!search && prevSearchRef.current) {
            getUserList({
                page: 1,
                pageSize: pagination.pageSize,
                search: "",
                forceRefresh: true
            });
        }

        prevSearchRef.current = search;

        if (!search) return;

        const delay = setTimeout(() => {
            getUserList({
                page: 1,
                pageSize: pagination.pageSize,
                search,
                forceRefresh: true
            });
        }, 500);

        return () => clearTimeout(delay);
    }, [search, pagination.pageSize]);

    const handleAdd = () => {
        setEditingUser(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleEdit = (record: User) => {
        setEditingUser(record);

        console.log(record)

        const formValues: any = {
            id: record.id,
            name: record.name,
            email: record.email,
            status: record.status === "Active",
            role_id: record.role_id,
            ...(record.password ? { password: record.password } : {}),
        };

        form.setFieldsValue(formValues);

        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        try {
            const data = { id }

            const res = await deleteUser(data);

            if (res?.success) {
                message.success('User deleted successfully');
                setPagination((prev: any) => ({
                    ...prev,
                    current: 1,
                    pageSize: 10,
                }));
            } else {
                message.error(res.message || 'User delete failed');
            }
        } catch (error) {
            console.error('Validation failed:', error);
        }
    };

    const handleOk = async () => {
        try {
            setSubmitLoading(true)
            const values = await form.validateFields();
            if (!values.password) {
                delete values.password;
            }

            const user = {
                ...values,
                status: values.status ? "active" : "inactive",
            };

            if (editingUser) {
                const data = {
                    ...user,
                    id: editingUser.id,
                }
                const res = await editUser(data);

                if (res?.success) {
                    message.success("User edit succesfully")
                    setPagination((prev: any) => ({
                        ...prev,
                        current: 1,
                        pageSize: 10,
                    }));
                    setIsModalOpen(false);
                } else {
                    message.error(res.message || 'User edit failed');
                }
            } else {
                const res = await addUser(user);

                if (res?.success) {
                    message.success("User added succesfully")
                    setPagination((prev: any) => ({
                        ...prev,
                        current: 1,
                        pageSize: 10,
                    }));
                    setIsModalOpen(false);
                } else {
                    message.error(res.message || 'User add failed');
                }
            }
        } catch (error) {
            console.error('Validation failed:', error);
        } finally {
            setSubmitLoading(false)
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const columns: ColumnsType<User> = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            sorter: true,
            render: (id: string) => <CopyToClipboard text={id} />
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            // sorter: (a: any, b: any) => a.name.localeCompare(b.name),
            sorter: true,
            render: (name: string) => <CopyToClipboard text={name} />
        },
        {
            title: 'API',
            dataIndex: 'api_key',
            key: 'api_key',
            sorter: true,
            render: (api_key: string) => <CopyToClipboard text={api_key} />

        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            // sorter: (a, b) => Number(a.status) - Number(b.status),
            sorter: true,
            render: (status: string) => (
                <Tag
                    color={
                        status.toLocaleLowerCase() === "active"
                            ? "success"
                            : status.toLocaleLowerCase() === "inactive"
                                ? "error"
                                : "default"
                    }
                >
                    {status}
                </Tag>
            ),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            // sorter: (a: any, b: any) => a?.email.localeCompare(b?.email),
            sorter: true,
            render: (email: string) => <CopyToClipboard text={email} />
        },
    ];

    if (canUpdate || canDelete) {
        columns.push({
            title: 'Action',
            key: 'action',
            width: 100,
            fixed: 'right',
            render: (_, record: User) => (
                <Space size="middle">
                    {canUpdate && (
                        <Button
                            type="text"
                            icon={<EditOutlined />}
                            onClick={() => handleEdit(record)}
                        />
                    )}

                    {canDelete && (
                        <Popconfirm
                            title="Delete user"
                            description="Are you sure you want to delete this user?"
                            onConfirm={() => handleDelete(record.id)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button type="text" danger icon={<DeleteOutlined />} />
                        </Popconfirm>
                    )}
                </Space>
            ),
        });
    }


    if (userLoading) return <LoadingPage />;
    if (!canRead) return <NoPermission />;

    return (
        <div style={{ padding: 24, }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Title level={2} style={{ margin: 0 }}>Users List</Title>
                {canCreate && <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                    Add User
                </Button>}
            </div>

            {canRead && (
                <>
                    <Input
                        style={{ marginBottom: "1rem" }}
                        prefix={<SearchOutlined />}
                        placeholder="Search"
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <Table<User>
                        columns={columns}
                        dataSource={userList}
                        rowKey="id"
                        loading={loading}
                        pagination={{
                            ...pagination,
                            total: userTotal,
                            showSizeChanger: true,
                            pageSizeOptions: ["10", "20", "50", "100"],
                        }}
                        onChange={handleTableChange}
                        scroll={{ x: 'max-content' }}
                        locale={{
                            emptyText: (
                                <Empty
                                    description="No User Found"
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                />
                            )
                        }}
                    />
                </>
            )}


            <Modal
                title={editingUser ? "Edit User" : "Add User"}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={submitLoading ? undefined : handleCancel}
                confirmLoading={submitLoading}
                okText="Save"
            >
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={{
                        gender: 'male', status: editingUser?.status === "Active"
                    }}
                >
                    <Form.Item
                        name="name"
                        label="Full Name"
                        rules={
                            [{ required: true, message: 'Please enter the user name' }]
                        }
                    >
                        <Input placeholder="Enter full name" />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        label="Email"
                        normalize={(value) => value?.trim()}
                        rules={[
                            { required: true, message: 'Please enter the email' },
                            { type: 'email', message: 'Please enter a valid email address' }
                        ]}
                    >
                        <Input placeholder="Enter email address" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="Password"
                        rules={!editingUser ? [{ required: true, message: 'Please enter password' }, { min: 8, message: "Minimum 8 character" }] : [{ min: 8, message: "Minimum 8 character" }]}
                    >
                        <Input.Password placeholder="Enter password" />
                    </Form.Item>

                    <Form.Item
                        name="role_id"
                        label="Role"
                        rules={[{ required: true, message: 'Please select role' }]}
                    >
                        <Select placeholder="Select role">
                            {/* <Select.Option value="1">Admin</Select.Option> */}
                            {roleList && roleList.length >= 0 && roleList?.map((a) => {
                                return (
                                    <Select.Option value={a.id}>{a.label}</Select.Option>
                                )
                            })
                            }
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="status"
                        label="Status"
                        valuePropName="checked"
                    >
                        <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
                    </Form.Item>
                </Form>
            </Modal>
        </div >
    );
}
