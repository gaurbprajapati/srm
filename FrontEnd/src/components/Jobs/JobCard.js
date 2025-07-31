import React, { useState } from 'react';
import { Card, Button, Modal, Form, Input, message, Spin, Select } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { jobAPI, apiUtils } from '../../utils/api';

export const JobCard = ({ job, onUpdate }) => {
    const [editVisible, setEditVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const user = apiUtils.getCurrentUser();

    const showEditModal = () => {
        form.setFieldsValue(job);
        setEditVisible(true);
    };

    const handleEditOk = async () => {
        try {
            const values = await form.validateFields();
            setLoading(true);

            const response = await jobAPI.updateJob(job._id, values);

            if (response.success) {
                setEditVisible(false);
                setLoading(false);
                message.success(response.message || 'Job updated successfully');
                form.resetFields();

                // Call the onUpdate callback to refresh the parent component
                if (onUpdate) {
                    onUpdate();
                }
            }
        } catch (err) {
            console.error(err);
            setLoading(false);
            const errorMessage = err.response?.data?.error || 'Failed to update job';
            message.error(errorMessage);
        }
    };

    const handleEditCancel = () => {
        setEditVisible(false);
        form.resetFields();
    };

    const deleteJob = async () => {
        setLoading(true);
        try {
            const response = await jobAPI.deleteJob(job._id);

            if (response.success) {
                setLoading(false);
                message.success(response.message || 'Job deleted successfully');

                // Call the onUpdate callback to refresh the parent component
                if (onUpdate) {
                    onUpdate();
                }
            }
        } catch (error) {
            console.error(error);
            setLoading(false);
            const errorMessage = error.response?.data?.error || 'Failed to delete job';
            message.error(errorMessage);
        }
    };

    const confirmDelete = () => {
        Modal.confirm({
            title: 'Are you sure you want to delete this Job?',
            content: 'This action cannot be undone.',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                deleteJob();
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };

    // Check if current user can edit/delete this job
    const canEdit = user && (user.isAdmin || (job.createdBy && job.createdBy._id === user._id));

    return (
        <Card
            style={{
                width: '100%',
                marginBottom: 16,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                borderRadius: '8px'
            }}
            actions={canEdit ? [
                <EditOutlined key="edit" onClick={showEditModal} />,
                <DeleteOutlined key="delete" onClick={confirmDelete} style={{ color: 'red' }} />
            ] : []}
        >
            {loading && <Spin size="large" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />}

            <Card.Meta
                title={<span style={{ fontSize: '18px', fontWeight: 'bold' }}>{job.title}</span>}
                description={
                    <div>
                        <p><strong>Company:</strong> {job.company}</p>
                        {job.location && <p><strong>Location:</strong> {job.location}</p>}
                        {job.salary && <p><strong>Salary:</strong> {job.salary}</p>}
                        {job.type && <p><strong>Type:</strong> {job.type}</p>}
                        {job.campus && <p><strong>Campus:</strong> {job.campus}</p>}
                        {job.description && (
                            <p><strong>Description:</strong> {job.description.substring(0, 100)}
                                {job.description.length > 100 ? '...' : ''}</p>
                        )}
                        {job.eligibility && <p><strong>Eligibility:</strong> {job.eligibility}</p>}
                        {job.createdBy && (
                            <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
                                Posted by: {job.createdBy.firstName || job.createdBy.username}
                            </p>
                        )}
                        <div style={{ marginTop: '10px' }}>
                            {job.linkedin && (
                                <Button
                                    type="link"
                                    href={job.linkedin}
                                    target="_blank"
                                    size="small"
                                >
                                    LinkedIn
                                </Button>
                            )}
                            {job.companyWebsite && (
                                <Button
                                    type="link"
                                    href={job.companyWebsite}
                                    target="_blank"
                                    size="small"
                                >
                                    Website
                                </Button>
                            )}
                        </div>
                    </div>
                }
            />

            {/* Edit Job Modal */}
            <Modal
                title="Edit Job"
                open={editVisible}
                onOk={handleEditOk}
                onCancel={handleEditCancel}
                width={800}
                confirmLoading={loading}
            >
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={job}
                >
                    <Form.Item
                        name="title"
                        label="Job Title"
                        rules={[{ required: true, message: 'Please enter job title' }]}
                    >
                        <Input placeholder="Enter job title" />
                    </Form.Item>

                    <Form.Item
                        name="company"
                        label="Company"
                        rules={[{ required: true, message: 'Please enter company name' }]}
                    >
                        <Input placeholder="Enter company name" />
                    </Form.Item>

                    <div style={{ display: 'flex', gap: '16px' }}>
                        <Form.Item name="type" label="Job Type" style={{ flex: 1 }}>
                            <Select>
                                <Select.Option value="full-time">Full Time</Select.Option>
                                <Select.Option value="part-time">Part Time</Select.Option>
                                <Select.Option value="internship">Internship</Select.Option>
                                <Select.Option value="contract">Contract</Select.Option>
                                <Select.Option value="freelance">Freelance</Select.Option>
                            </Select>
                        </Form.Item>

                        <Form.Item name="campus" label="Campus Type" style={{ flex: 1 }}>
                            <Select>
                                <Select.Option value="on-campus">On Campus</Select.Option>
                                <Select.Option value="off-campus">Off Campus</Select.Option>
                            </Select>
                        </Form.Item>

                        <Form.Item name="location" label="Location" style={{ flex: 1 }}>
                            <Input placeholder="Job location" />
                        </Form.Item>
                    </div>

                    <Form.Item name="salary" label="Salary">
                        <Input placeholder="Salary range" />
                    </Form.Item>

                    <Form.Item name="description" label="Job Description">
                        <Input.TextArea rows={4} placeholder="Describe the job role and responsibilities" />
                    </Form.Item>

                    <Form.Item name="eligibility" label="Eligibility">
                        <Input.TextArea rows={2} placeholder="Eligibility criteria" />
                    </Form.Item>

                    <div style={{ display: 'flex', gap: '16px' }}>
                        <Form.Item name="linkedin" label="LinkedIn" style={{ flex: 1 }}>
                            <Input placeholder="LinkedIn profile/company page" />
                        </Form.Item>

                        <Form.Item name="companyWebsite" label="Company Website" style={{ flex: 1 }}>
                            <Input placeholder="Company website URL" />
                        </Form.Item>
                    </div>
                </Form>
            </Modal>
        </Card>
    );
};
