import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, Row, Col, Select, Pagination, message, Spin, Form, Input, button, Button } from 'antd';
import DefaultLayout from '../DefaultLayout';
import { JobCard } from './JobCard';
import { Checkbox } from 'antd';

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
                const res = await axios.get('http://localhost:5000/jobs');

                setJobs(res.data);
                setLoading(false);
                // message.success('Jobs fetched successfully');
            } catch (err) {
                console.error(err);
                setLoading(false);
                // message.error('Failed to fetch jobs');
            }
        };
        fetchJobs();
    }, []);


    // useEffect(() => {
    const handleEditOk = async () => {
        const values = await form.validateFields();
        setLoading(true);
        try {
            const response = await axios.post("http://localhost:5000/create-jobs", values);
            setJobs(response.data);
            setEditVisible(false);
            setLoading(false);
            message.success('Job updated successfully');
        } catch (err) {
            console.error(err);
            setLoading(false);
            message.error('Failed to update job');
        }
    };
    //     handleEditOk()
    // }, [jobs, form]);

    const showEditModal = () => {
        setEditVisible(true);
    };


    const handleClick = checkedValues => {
        setType(checkedValues);
    };

    const handleJobUpdate = (updatedJob) => {
        setJobs(jobs.map(job => job._id === updatedJob._id ? updatedJob : job));
    };

    const handleJobDelete = (deletedJobId) => {
        setJobs(jobs.filter(job => job._id !== deletedJobId));
    };

    if (loading) {
        return <Spin size='large' />
    }


    const handleEditCancel = () => {
        setEditVisible(false);
    };






    console.log('jobs:', jobs);
    console.log('type:', type);
    const filteredJobs = type.includes('All') ? jobs : jobs.filter(job => {
        console.log('job.type:', job.type);
        return type.includes(job.type);
    });
    console.log('filteredJobs:', filteredJobs);

    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;
    const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

    const paginate = pageNumber => setCurrentPage(pageNumber);

    return (
        <DefaultLayout>
            {/* <Menu onClick={handleClick} selectedKeys={[type]} mode="horizontal">
                <Menu.Item key="All">All</Menu.Item>
                <Menu.Item key="Full-time">Full-time</Menu.Item>
                <Menu.Item key="Part-time">Part-time</Menu.Item> */}
            {/* Add more Menu.Items as needed */}
            {/* </Menu> */}

            <Checkbox.Group onChange={handleClick} defaultValue={['All']}>
                <Checkbox value="All">All</Checkbox>
                <Checkbox value="Full-time">Full-time</Checkbox>
                <Checkbox value="Part-time">Part-time</Checkbox>
                <Checkbox value="Internship">Internship</Checkbox>
                <Checkbox value="On-Compus">On-Compus</Checkbox>
                <Checkbox value="Off-Compus">Off-Compus</Checkbox>
                {/* Add more Checkboxes as needed */}
            </Checkbox.Group>
            <Button onClick={showEditModal}>Add Jobs</Button>

            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', padding: '20px 0' }}>
                {currentJobs.map(job => (
                    <JobCard key={job._id} job={job} onJobUpdate={handleJobUpdate} onJobDelete={handleJobDelete} />
                ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <Pagination
                    current={currentPage}
                    total={filteredJobs.length}
                    pageSize={jobsPerPage}
                    onChange={paginate}
                />
            </div>

            <Modal title="Add Job" visible={editVisible} onOk={handleEditOk} onCancel={handleEditCancel}>
                <Form form={form} layout="vertical">
                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item name="title" label="Title" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="company" label="Company" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="location" label="Location">
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item name="description" label="Description">
                                <Input.TextArea />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="requirements" label="Requirements">
                                <Input.TextArea />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="eligibility" label="Eligibility">
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item name="linkedin" label="LinkedIn">
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="companyWebsite" label="Company Website">
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={8}>

                            <Form.Item name="salary" label="Salary">
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item name="type" label="Type">
                        <Select>
                            <Select.Option value="Part-time">Part-time</Select.Option>
                            <Select.Option value="Full-time">Full-time</Select.Option>
                            <Select.Option value="Internship">Internship</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="campus" label="Campus">
                        <Select>
                            <Select.Option value="Off-Compus">Off-Compus</Select.Option>
                            <Select.Option value="On-Compus">On-Compus</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>

        </DefaultLayout>
    );
};

// export default JobHome;