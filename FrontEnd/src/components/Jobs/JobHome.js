import React, { useEffect, useState } from 'react';
import { Modal, Row, Col, Select, Pagination, message, Spin, Form, Input, Button } from 'antd';
import DefaultLayout from '../DefaultLayout';
import { JobCard } from './JobCard';
import { jobAPI, apiUtils } from '../../utils/api';

export const JobHome = () => {
    const [jobs, setJobs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [jobsPerPage] = useState(4);
    const [type, setType] = useState('All');
    const [loading, setLoading] = useState(false);
    const [editVisible, setEditVisible] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        const fetchJobs = async () => {
            setLoading(true);
            try {
                const response = await jobAPI.getJobs({
                    page: currentPage,
                    limit: jobsPerPage,
                    type: type !== 'All' ? type : undefined
                });

                if (response.success) {
                    setJobs(response.data || []);
                } else {
                    setJobs([]);
                }
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
                message.error('Failed to fetch jobs');
                setJobs([]);
            }
        };
        fetchJobs();
    }, [currentPage, type, jobsPerPage]);

    const handleEditOk = async () => {
        try {
            const values = await form.validateFields();
            setLoading(true);

            const response = await jobAPI.createJob(values);

            if (response.success) {
                // Refresh jobs list
                const updatedJobs = await jobAPI.getJobs({
                    page: currentPage,
                    limit: jobsPerPage,
                    type: type !== 'All' ? type : undefined
                });

                if (updatedJobs.success) {
                    setJobs(updatedJobs.data || []);
                }

                setEditVisible(false);
                form.resetFields();
                setLoading(false);
                message.success(response.message || 'Job created successfully');
            }
        } catch (err) {
            console.error(err);
            setLoading(false);
            const errorMessage = err.response?.data?.error || 'Failed to create job';
            message.error(errorMessage);
        }
    };

    const handleEditCancel = () => {
        setEditVisible(false);
        form.resetFields();
    };

    // Filter jobs based on type
    const filteredJobs = type === 'All' ? jobs : jobs.filter(job => job.type === type);

    // Pagination
    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;
    const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

    return (
        <DefaultLayout>
            <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h1>Campus Jobs & Opportunities</h1>

                    {/* Job Type Filter */}
                    <Select
                        value={type}
                        onChange={setType}
                        style={{ width: 200 }}
                        placeholder="Filter by type"
                    >
                        <Select.Option value="All">All Types</Select.Option>
                        <Select.Option value="full-time">Full Time</Select.Option>
                        <Select.Option value="part-time">Part Time</Select.Option>
                        <Select.Option value="internship">Internship</Select.Option>
                        <Select.Option value="contract">Contract</Select.Option>
                        <Select.Option value="freelance">Freelance</Select.Option>
                    </Select>
                </div>

                {/* Add Job Button - Only for authenticated users */}
                {apiUtils.isAuthenticated() && (
                    <div style={{ marginBottom: '20px' }}>
                        <Button
                            type="primary"
                            onClick={() => setEditVisible(true)}
                            size="large"
                        >
                            Post New Job
                        </Button>
                    </div>
                )}

                {/* Jobs Loading State */}
                {loading && (
                    <div style={{ textAlign: 'center', padding: '50px' }}>
                        <Spin size="large" />
                        <p>Loading jobs...</p>
                    </div>
                )}

                {/* Jobs Grid */}
                {!loading && (
                    <>
                        {currentJobs.length > 0 ? (
                            <Row gutter={[16, 16]}>
                                {currentJobs.map((job, index) => (
                                    <Col key={job._id || index} xs={24} sm={12} lg={8} xl={6}>
                                        <JobCard job={job} onUpdate={() => {
                                            // Refresh jobs after update
                                            const fetchJobs = async () => {
                                                const response = await jobAPI.getJobs({
                                                    page: currentPage,
                                                    limit: jobsPerPage,
                                                    type: type !== 'All' ? type : undefined
                                                });
                                                if (response.success) {
                                                    setJobs(response.data || []);
                                                }
                                            };
                                            fetchJobs();
                                        }} />
                                    </Col>
                                ))}
                            </Row>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '40px' }}>
                                <h3>No jobs found</h3>
                                <p>
                                    {type === 'All'
                                        ? 'No jobs are currently available.'
                                        : `No ${type} jobs found.`
                                    }
                                </p>
                                {apiUtils.isAuthenticated() && (
                                    <Button
                                        type="primary"
                                        onClick={() => setEditVisible(true)}
                                        style={{ marginTop: '20px' }}
                                    >
                                        Post the first {type !== 'All' ? type : ''} job!
                                    </Button>
                                )}
                            </div>
                        )}

                        {/* Pagination */}
                        {filteredJobs.length > jobsPerPage && (
                            <div style={{ textAlign: 'center', marginTop: '40px' }}>
                                <Pagination
                                    current={currentPage}
                                    total={filteredJobs.length}
                                    pageSize={jobsPerPage}
                                    onChange={setCurrentPage}
                                    showSizeChanger={false}
                                    showQuickJumper
                                    showTotal={(total, range) =>
                                        `${range[0]}-${range[1]} of ${total} jobs`
                                    }
                                />
                            </div>
                        )}
                    </>
                )}

                {/* Create Job Modal */}
                <Modal
                    title="Post New Job"
                    open={editVisible}
                    onOk={handleEditOk}
                    onCancel={handleEditCancel}
                    width={800}
                    confirmLoading={loading}
                >
                    <Form
                        form={form}
                        layout="vertical"
                        initialValues={{ type: 'full-time', campus: 'off-campus' }}
                    >
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="title"
                                    label="Job Title"
                                    rules={[{ required: true, message: 'Please enter job title' }]}
                                >
                                    <Input placeholder="Enter job title" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="company"
                                    label="Company"
                                    rules={[{ required: true, message: 'Please enter company name' }]}
                                >
                                    <Input placeholder="Enter company name" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item name="type" label="Job Type">
                                    <Select>
                                        <Select.Option value="full-time">Full Time</Select.Option>
                                        <Select.Option value="part-time">Part Time</Select.Option>
                                        <Select.Option value="internship">Internship</Select.Option>
                                        <Select.Option value="contract">Contract</Select.Option>
                                        <Select.Option value="freelance">Freelance</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="campus" label="Campus Type">
                                    <Select>
                                        <Select.Option value="on-campus">On Campus</Select.Option>
                                        <Select.Option value="off-campus">Off Campus</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="location" label="Location">
                                    <Input placeholder="Job location" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item name="salary" label="Salary">
                            <Input placeholder="Salary range" />
                        </Form.Item>

                        <Form.Item name="description" label="Job Description">
                            <Input.TextArea rows={4} placeholder="Describe the job role and responsibilities" />
                        </Form.Item>

                        <Form.Item name="eligibility" label="Eligibility">
                            <Input.TextArea rows={2} placeholder="Eligibility criteria" />
                        </Form.Item>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item name="linkedin" label="LinkedIn">
                                    <Input placeholder="LinkedIn profile/company page" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="companyWebsite" label="Company Website">
                                    <Input placeholder="Company website URL" />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Modal>
            </div>
        </DefaultLayout>
    );
};