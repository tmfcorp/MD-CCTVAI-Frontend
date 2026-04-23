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
    Row,
    Col,
    Card,
    Checkbox,
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

const { Title, Text } = Typography;

const { TextArea } = Input;


interface PermissionGroup {
    id: string;
    name: string;
    description: string;
    permissions: {
        module: string;
        action: string;
    }[];
    status: string
}

interface Permission {
    id: string;
    module: string;
    action: string;
    description: string;
}

const actions = ["read", "create", "update", "delete"];

export default function PermissionGroupPage() {
    const { message } = App.useApp();
    const { permissionGroupsList, allPermissions, deletePermissionGroup, getPermissionGroupsList, permissionGroupsTotal, editPermissionGroup, addPermissionGroup } = useData();
    const { abilityFor } = useAbility();
    const {
        canRead,
        canCreate,
        canUpdate,
        canDelete,
    } = abilityFor("permissiongroups");
    const [search, setSearch] = useState<string>();
    const [loading, setLoading] = useState<boolean>(false);
    const [submitLoading, setSubmitLoading] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPermissionGroup, setEditingPermissionGroup] = useState<PermissionGroup | null>(null);
    const [form] = Form.useForm();
    const [selectedPermissions, setSelectedPermissions] = useState<Record<string, string[]>>({});
    const [pagination, setPagination] = useState<TablePaginationConfig>({
        current: 1,
        pageSize: 10,
    });
    const permissionGroupCache = useRef<
        Record<string, { data: PermissionGroup[]; total: number }>
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
            "permissionGroup",
            currentPage,
            newPagination.pageSize!,
            search,
            sortField,
            sortOrder
        );

        try {
            const res: any = await getPermissionGroupsList({
                page: currentPage,
                pageSize: newPagination.pageSize!,
                search,
                sortField: finalSortField,
                sortOrder: order,
            });

            if (res?.data) {
                permissionGroupCache.current[cacheKey] = {
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
            getPermissionGroupsList({
                page: 1,
                pageSize: pagination.pageSize,
                search: "",
                forceRefresh: true
            });
        }

        prevSearchRef.current = search;

        if (!search) return;

        const delay = setTimeout(() => {
            getPermissionGroupsList({
                page: 1,
                pageSize: pagination.pageSize,
                search,
                forceRefresh: true
            });
        }, 500);

        return () => clearTimeout(delay);
    }, [search, pagination.pageSize]);

    const handleAdd = () => {
        setEditingPermissionGroup(null);

        const initial: Record<string, string[]> = {};
        Object.keys(groupedPermissions).forEach((module) => {
            initial[module] = [];
        });

        setSelectedPermissions(initial);

        form.resetFields();
        form.setFieldsValue({ status: true });
        setIsModalOpen(true);
    };

    const handleEdit = (record: PermissionGroup) => {
        setEditingPermissionGroup(record);

        const initial: Record<string, string[]> = {};
        Object.keys(groupedPermissions).forEach((module) => {
            initial[module] = [];
        });

        record.permissions.forEach((perm) => {
            if (!initial[perm.module]) initial[perm.module] = [];
            initial[perm.module].push(perm.action);
        });

        setSelectedPermissions(initial);

        console.log(record)

        form.setFieldsValue({
            id: record.id,
            name: record.name,
            description: record.description,
            status: record.status === "Active",
        });

        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        try {
            const data = { id }

            const res = await deletePermissionGroup(data);

            if (res?.success) {
                message.success('Permission Group deleted successfully');
                setPagination((prev: any) => ({
                    ...prev,
                    current: 1,
                    pageSize: 10,
                }));
            } else {
                message.error(res.message || 'Permission Group delete failed');
            }
        } catch (error) {
            console.error('Validation failed:', error);
        }
    };

    const handleOk = async () => {
        try {
            setSubmitLoading(true)
            const values = await form.validateFields();

            const permissions = Object.entries(selectedPermissions)
                .map(([module, actions]) => actions.length ? { module, actions } : null)
                .filter(Boolean);

            const payload = {
                name: values.name,
                description: values.description,
                status: values.status ? "Active" : "Inactive",
                permissions,
            };

            console.log('Final payload:', payload);


            if (editingPermissionGroup) {
                const data = {
                    id: editingPermissionGroup.id,
                    ...payload
                };
                console.log(data)
                const res = await editPermissionGroup(data);
                if (res?.success) {
                    message.success('Permission Groups edit successfully');
                    setPagination((prev: any) => ({
                        ...prev,
                        current: 1,
                        pageSize: 10,
                    }));
                    setIsModalOpen(false);
                } else {
                    message.error(res.message || 'Permission Groups edit failed');
                }
            } else {

                const res = await addPermissionGroup(payload);

                if (res?.success) {
                    message.success('Permission Groups added successfully');
                    setPagination((prev: any) => ({
                        ...prev,
                        current: 1,
                        pageSize: 10,
                    }));
                    setIsModalOpen(false);
                } else {
                    message.error(res.message || 'Permission Groups add failed');
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

    const columns: ColumnsType<PermissionGroup> = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            sorter: true,
            width: 150,
            render: (id: string) => <CopyToClipboard text={id} />
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            sorter: true,
        },
        {
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

    const groupedPermissions = allPermissions.reduce(
        (acc: Record<string, string[]>, perm: Permission) => {
            if (!acc[perm.module]) {
                acc[perm.module] = [];
            }
            acc[perm.module].push(perm.action);
            return acc;
        },
        {}
    );

    const tableColumns = [
        {
            title: "Module",
            dataIndex: "module",
            key: "module",
            render: (text: string) => <strong>{text.toUpperCase()}</strong>,
        },
        ...actions.map((action) => ({
            title: action.charAt(0).toUpperCase() + action.slice(1),
            key: action,
            align: "center" as any,
            render: (_: any, record: any) => {
                if (!record.actions.includes(action)) return null;

                const current = selectedPermissions[record.module] || [];

                return (
                    <Checkbox
                        checked={current.includes(action)}
                        onChange={(e) => {
                            const updated = e.target.checked
                                ? [...current, action]
                                : current.filter(a => a !== action);

                            setSelectedPermissions(prev => ({
                                ...prev,
                                [record.module]: updated,
                            }));
                        }}
                    />
                );
            }
        })),
    ];

    const dataSource = Object.entries(groupedPermissions).map(
        ([module, actions]) => ({
            key: module,
            module,
            actions,
        })
    );

    if (canUpdate || canDelete) {
        columns.push({
            title: 'Action',
            key: 'action',
            fixed: 'right',
            render: (_, record: PermissionGroup) => (
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
                            title="Delete permission group"
                            description="Are you sure you want to delete this permission group?"
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


    if (!canRead) {
        return <NoPermission />;
    }

    return (
        <div style={{ padding: 24 }}>
            <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Col style={{ marginBottom: 16 }}>
                    <Title level={2} style={{ margin: 0 }}>Permission Group List</Title>
                </Col>
                <Col style={{ marginBottom: 16 }}>
                    {canCreate && <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                        Add Permission Group
                    </Button>}
                </Col>
            </Row>


            {canRead && (
                <>
                    <Input
                        style={{ marginBottom: "1rem" }}
                        prefix={<SearchOutlined />}
                        placeholder="Search"
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <Table<PermissionGroup>
                        columns={columns}
                        dataSource={permissionGroupsList}
                        rowKey="id"
                        loading={loading}
                        pagination={{
                            ...pagination,
                            total: permissionGroupsTotal,
                            showSizeChanger: true,
                            pageSizeOptions: ["10", "20", "50", "100"],
                        }}
                        onChange={handleTableChange}
                        scroll={{ x: 'max-content' }}
                        locale={{
                            emptyText: (
                                <Empty
                                    description="No Permission Found"
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                />
                            )
                        }}
                    />
                </>
            )}

            <Modal
                title={editingPermissionGroup ? "Edit Permission Group" : "Add Permission Group"}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={submitLoading ? undefined : handleCancel}
                confirmLoading={submitLoading}
                okText="Save"
                width={1000}
                centered
            >
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={{
                        status: editingPermissionGroup?.status === "Active",
                    }}
                >
                    <Row gutter={24}>
                        {/* Left Column - Basic Info */}
                        <Col xs={24} md={8}>
                            <Form.Item
                                name="name"
                                label="Name"
                                rules={[
                                    { required: true, message: "Please enter the name" },
                                    { max: 50, message: "Max 50 Characters" }
                                ]}
                            >
                                <Input placeholder="Enter full name" maxLength={50} />
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
                                rules={[{ max: 200, message: "Max 200 characters" }]}
                            >
                                <TextArea placeholder="Enter description" rows={4} />
                            </Form.Item>
                        </Col>

                        {/* Right Column - Permissions Table */}
                        <Col xs={24} md={16}>
                            <Row justify="space-between" style={{ marginBottom: 12 }}>
                                <Col>
                                    <Button
                                        type="primary"
                                        onClick={() => {
                                            const allSelected = Object.keys(groupedPermissions).reduce(
                                                (acc, module) => ({ ...acc, [module]: [...groupedPermissions[module]] }),
                                                {}
                                            );
                                            setSelectedPermissions(allSelected);
                                        }}
                                        style={{ marginRight: 8 }}
                                    >
                                        Select All
                                    </Button>
                                    <Button
                                        type="default"
                                        onClick={() => {
                                            const noneSelected = Object.keys(groupedPermissions).reduce(
                                                (acc, module) => ({ ...acc, [module]: [] }),
                                                {}
                                            );
                                            setSelectedPermissions(noneSelected);
                                        }}
                                    >
                                        Unselect All
                                    </Button>
                                </Col>
                            </Row>

                            <div style={{ maxHeight: 350, overflowY: "auto", border: "1px solid #f0f0f0", borderRadius: 8 }}>
                                <Table
                                    columns={tableColumns}
                                    dataSource={dataSource}
                                    pagination={false}
                                    bordered={false}
                                    size="small"
                                    scroll={{ x: true }}
                                    rowClassName={() => "custom-row"}
                                    style={{
                                        borderRadius: 8,
                                        margin: 0,
                                        padding: 0,
                                    }}
                                />
                            </div>
                        </Col>
                    </Row>
                </Form>
            </Modal>

        </div >
    );
}
