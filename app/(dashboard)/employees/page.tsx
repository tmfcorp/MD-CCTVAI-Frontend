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


interface Employee {
    id: string;
    name: string;
    employee_code: string;
    department: string;
    position: string;
    ai_tracking_enabled: boolean;
    status: string
}


export default function EmployeePage() {
    const { message } = App.useApp();
    const { employeeList, employeeLoading, addEmployee, editEmployee, deleteEmployee, permissionGroupsList, getEmployeeList, employeeTotal } = useData();
    const { abilityFor } = useAbility();
    const {
        canRead,
        canCreate,
        canUpdate,
        canDelete,
    } = abilityFor("employees");
    const [search, setSearch] = useState<string>();
    const [loading, setLoading] = useState<boolean>(false);
    const [submitLoading, setSubmitLoading] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
    const [form] = Form.useForm();
    const [pagination, setPagination] = useState<TablePaginationConfig>({
        current: 1,
        pageSize: 10,
    });
    const employeeCache = useRef<
        Record<string, { data: Employee[]; total: number }>
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
            "employee",
            currentPage,
            newPagination.pageSize!,
            search,
            sortField,
            sortOrder
        );

        try {
            const res: any = await getEmployeeList({
                page: currentPage,
                pageSize: newPagination.pageSize!,
                search,
                sortField: finalSortField,
                sortOrder: order,
            });

            if (res?.data) {
                employeeCache.current[cacheKey] = {
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
            getEmployeeList({
                page: 1,
                pageSize: pagination.pageSize,
                search: "",
                forceRefresh: true
            });
        }

        prevSearchRef.current = search;

        if (!search) return;

        const delay = setTimeout(() => {
            getEmployeeList({
                page: 1,
                pageSize: pagination.pageSize,
                search,
                forceRefresh: true
            });
        }, 500);

        return () => clearTimeout(delay);
    }, [search, pagination.pageSize]);

    const handleAdd = () => {
        setEditingEmployee(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleEdit = (record: Employee) => {
        setEditingEmployee(record);

        const formValues = {
            id: record.id,
            name: record.name,
            employee_code: record.employee_code,
            department: record.department,
            position: record.position,
            ai_tracking_enabled: record.ai_tracking_enabled,
            status: record.status,
        };

        form.setFieldsValue(formValues);

        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        try {
            const data = { id }

            const res = await deleteEmployee(data);

            if (res?.success) {
                message.success('Employee deleted successfully');
                setPagination((prev: any) => ({
                    ...prev,
                    current: 1,
                    pageSize: 10,
                }));
            } else {
                message.error(res.message || 'Employee delete failed');
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

            if (editingEmployee) {

                const data = {
                    id: editingEmployee.id,
                    label: values.label,
                    permission_group_id: permissionId,
                    status: values.status ? "active" : "inactive",
                };

                console.log(data)


                const res = await editEmployee(data);
                if (res?.success) {
                    message.success('Employee edit successfully')
                    setPagination((prev: any) => ({
                        ...prev,
                        current: 1,
                        pageSize: 10,
                    }));
                    setIsModalOpen(false);
                } else {
                    message.error(res.message || 'Employee edit failed');
                }

            } else {
                const data = {
                    label: values.label,
                    permission_group_id: permissionId
                };
                console.log(data)

                const res = await addEmployee(data);

                if (res?.success) {
                    message.success('Employee added successfully');
                    setPagination((prev: any) => ({
                        ...prev,
                        current: 1,
                        pageSize: 10,
                    }));
                    setIsModalOpen(false);
                } else {
                    message.error(res.message || 'Employee add failed');
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

    const columns: ColumnsType<Employee> = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            sorter: true,
            width: 150,
            render: (id: string) => <CopyToClipboard text={id} />
        },
        {
            title: 'Employee Code',
            dataIndex: 'employee_code',
            key: 'employee_code',
            sorter: true,
        },
        {
            title: 'Department',
            dataIndex: 'department',
            key: 'department',
            sorter: true,
        },
        {
            title: 'Position',
            dataIndex: 'position',
            key: 'position',
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

    if (canUpdate || canDelete) {
        columns.push({
            title: 'Action',
            key: 'action',
            fixed: 'right',
            render: (_, record: Employee) => (
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
                            title="Delete employee"
                            description="Are you sure you want to delete this employee?"
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


    if (employeeLoading) return <LoadingPage />;
    if (!canRead) return <NoPermission />;

    return (
        <div style={{ padding: 24, }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Title level={2} style={{ margin: 0 }}>Employees List</Title>
                {canCreate && <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                    Add Employee
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
                    <Table<Employee>
                        columns={columns}
                        dataSource={employeeList}
                        rowKey="id"
                        loading={loading}
                        pagination={{
                            ...pagination,
                            total: employeeTotal,
                            showSizeChanger: true,
                            pageSizeOptions: ["10", "20", "50", "100"],
                        }}
                        onChange={handleTableChange}
                        scroll={{ x: 'max-content' }}
                        locale={{
                            emptyText: (
                                <Empty
                                    description="No Employee Found"
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                />
                            )
                        }}
                    />
                </>
            )}


            <Modal
                title={editingEmployee ? "Edit Employee" : "Add Employee"}
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
                        name="employee_code"
                        label="Employee Code"
                        rules={
                            [{ required: true, message: 'Please enter the employee code' }, { max: 50, message: 'Max 50 Characters' }]
                        }
                    >
                        <Input placeholder="Enter full employee code" maxLength={50} />
                    </Form.Item>

                    <Form.Item
                        name="name"
                        label="Name"
                        rules={
                            [{ required: true, message: 'Please enter the name' }, { max: 50, message: 'Max 50 Characters' }]
                        }
                    >
                        <Input placeholder="Enter full name" maxLength={50} />
                    </Form.Item>

                    <Form.Item
                        name="department"
                        label="Department"
                        rules={
                            [{ required: true, message: 'Please enter the department' }, { max: 50, message: 'Max 50 Characters' }]
                        }
                    >
                        <Input placeholder="Enter full employee code" maxLength={50} />
                    </Form.Item>

                    <Form.Item
                        name="position"
                        label="Position"
                        rules={
                            [{ required: true, message: 'Please enter the position' }, { max: 50, message: 'Max 50 Characters' }]
                        }
                    >
                        <Input placeholder="Enter full employee code" maxLength={50} />
                    </Form.Item>

                    <Form.Item
                        name="ai_tracking_enabled"
                        label="AI Tracking"
                        valuePropName="checked"
                    >
                        <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
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
