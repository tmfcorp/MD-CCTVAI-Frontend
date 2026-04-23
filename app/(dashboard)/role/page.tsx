"use client";

import React, { useEffect, useRef, useState } from 'react';
import {
    Table,
    Button,
    Modal,
    Form,
    Input,
    Space,
    Popconfirm,
    Typography,
    App,
    Tag,
    Select,
    Switch,
    Empty,
} from 'antd';
import Icon, {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    SearchOutlined
} from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import { useData } from '@/context/DataContext';
import { useAbility } from '@/context/AbilityContext';
import { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { buildCacheKey } from '@/components/cacheKey';
import { CopyToClipboard } from '@/components/copyToClipboard';
import NoPermission from '@/components/noPermission';
import LoadingPage from '@/components/loadingPage';

const { Title, Text } = Typography;

const { TextArea } = Input;


interface Role {
    id: string;
    label: string;
    description: string;
    permission_group_id: {
        id: string;
        name: string;
    }[];
    status: string
}
export default function RolePage() {
    const { message } = App.useApp();
    const { roleList, roleLoading, addRole, editRole, deleteRole, permissionGroupsList, getRoleList, roleTotal } = useData();
    const { abilityFor } = useAbility();
    const {
        canRead,
        canCreate,
        canUpdate,
        canDelete,
    } = abilityFor("roles");
    const [roles, setRoles] = useState<Role[]>([]);
    const [search, setSearch] = useState<string>();
    const [loading, setLoading] = useState<boolean>(false);
    const [submitLoading, setSubmitLoading] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRole, setEditingRole] = useState<Role | null>(null);
    const [form] = Form.useForm();
    const [pagination, setPagination] = useState<TablePaginationConfig>({
        current: 1,
        pageSize: 10,
    });
    const roleCache = useRef<
        Record<string, { data: Role[]; total: number }>
    >({});

    const handleTableChange = async (
        newPagination: TablePaginationConfig,
        _filter: any,
        sorter: any
    ) => {
        setLoading(true);

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
            "role",
            currentPage,
            newPagination.pageSize!,
            search,
            sortField,
            sortOrder
        );

        try {
            const res: any = await getRoleList({
                page: currentPage,
                pageSize: newPagination.pageSize!,
                search,
                sortField: finalSortField,
                sortOrder: order,
            });

            if (res?.data) {
                roleCache.current[cacheKey] = {
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
            getRoleList({
                page: 1,
                pageSize: pagination.pageSize,
                search: "",
                forceRefresh: true
            });
        }

        prevSearchRef.current = search;

        if (!search) return;

        const delay = setTimeout(() => {
            getRoleList({
                page: 1,
                pageSize: pagination.pageSize,
                search,
                forceRefresh: true
            });
        }, 500);

        return () => clearTimeout(delay);
    }, [search, pagination.pageSize]);

    const handleAdd = () => {
        setEditingRole(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleEdit = (record: Role) => {
        setEditingRole(record);

        console.log(record)

        const formValues = {
            id: record.id,
            label: record.label,
            description: record.description,
            permission_group_id: record.permission_group_id?.map(
                group => group.id,
            ),
        };

        form.setFieldsValue(formValues);

        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        try {
            const data = { id }

            const res = await deleteRole(data);

            if (res?.success) {
                message.success('Role deleted successfully');
                setPagination((prev: any) => ({
                    ...prev,
                    current: 1,
                    pageSize: 10,
                }));
            } else {
                message.error(res.message || 'Role delete failed');
            }
        } catch (error) {
            console.error('Validation failed:', error);
        }
    };

    const handleOk = async () => {
        try {
            setSubmitLoading(true)
            const values = await form.validateFields();

            const permissionId = Array.isArray(values.permission_group_id)
                ? values.permission_group_id[0]
                : values.permission_group_id;

            if (editingRole) {

                const data = {
                    id: editingRole.id,
                    label: values.label,
                    permission_group_id: permissionId,
                    status: values.status ? "active" : "inactive",
                };

                console.log(data)


                const res = await editRole(data);
                if (res?.success) {
                    message.success('Role edit successfully')
                    setPagination((prev: any) => ({
                        ...prev,
                        current: 1,
                        pageSize: 10,
                    }));
                    setIsModalOpen(false);
                } else {
                    message.error(res.message || 'Role edit failed');
                }

            } else {
                const data = {
                    label: values.label,
                    permission_group_id: permissionId
                };
                console.log(data)

                const res = await addRole(data);

                if (res?.success) {
                    message.success('Role added successfully');
                    setPagination((prev: any) => ({
                        ...prev,
                        current: 1,
                        pageSize: 10,
                    }));
                    setIsModalOpen(false);
                } else {
                    message.error(res.message || 'Role add failed');
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

    const columns: ColumnsType<Role> = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            sorter: true,
            width: 150,
            render: (id: string) => <CopyToClipboard text={id} />
        },
        {
            title: 'Label',
            dataIndex: 'label',
            key: 'label',
            sorter: true,
        },
        {
            title: 'Permission Groups',
            dataIndex: 'permission_group_id',
            key: 'permission_group_id',
            render: (groups: { id: string; name: string }[]) =>
                groups?.length ? (
                    <>
                        {groups.map(group => (
                            <Tag key={group.id} color="blue">
                                {group.name}
                            </Tag>
                        ))}
                    </>
                ) : (
                    '-'
                ),
        }, {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
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
    ];

    if (canUpdate || canDelete) {
        columns.push({
            title: 'Action',
            key: 'action',
            fixed: 'right',
            render: (_, record: Role) => (
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
                            title="Delete role"
                            description="Are you sure you want to delete this role?"
                            onConfirm={() => handleDelete(record.id)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button type="text" danger icon={<DeleteOutlined />} />
                        </Popconfirm>
                    )}
                </Space>
            ),
            width: 100
        });
    }


    if (roleLoading) return <LoadingPage />;
    if (!canRead) return <NoPermission />;

    return (
        <div style={{ padding: 24, }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Title level={2} style={{ margin: 0 }}>Roles List</Title>
                {canCreate && <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                    Add Role
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
                    <Table<Role>
                        columns={columns}
                        dataSource={roleList}
                        rowKey="id"
                        loading={loading}
                        pagination={{
                            ...pagination,
                            total: roleTotal,
                            showSizeChanger: true,
                            pageSizeOptions: ["10", "20", "50", "100"],
                        }}
                        onChange={handleTableChange}
                        scroll={{ x: 'max-content' }}
                        locale={{
                            emptyText: (
                                <Empty
                                    description="No Role Found"
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                />
                            )
                        }}
                    />
                </>
            )}


            <Modal
                title={editingRole ? "Edit Role" : "Add Role"}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={submitLoading ? undefined : handleCancel}
                confirmLoading={submitLoading}
                okText="Save"
            >
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={{ status: 'active' }}
                >
                    <Form.Item
                        name="label"
                        label="Label"
                        rules={
                            [{ required: true, message: 'Please enter the label' }, { max: 50, message: 'Max 50 Characters' }]
                        }
                    >
                        <Input placeholder="Enter full label" maxLength={50} />
                    </Form.Item>

                    <Form.Item
                        name="permission_group_id"
                        label="Permission Groups"
                        rules={[{ required: true, message: 'Please select permission group' }]}
                    >
                        <Select placeholder="Select Permission Group">
                            {/* <Select.Option value="1">Admin</Select.Option> */}
                            {permissionGroupsList && permissionGroupsList.length >= 0 && permissionGroupsList?.map((a) => {
                                return (
                                    <Select.Option value={a.id}>{a.name}</Select.Option>
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

                    <Form.Item
                        name="description"
                        label="Description"
                        rules={
                            [{ message: "Max 20 characters", max: 200 }]
                        }
                    >
                        <TextArea placeholder="Enter full description" maxLength={200} />
                    </Form.Item>

                </Form>
            </Modal>
        </div >
    );
}
