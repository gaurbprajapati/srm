import { React, useState } from 'react'
import { Card, Modal, Button, Form, Input, Badge } from 'antd';
import { Row, Col, Select, Checkbox, message, Spin } from 'antd';
import axios from 'axios';

export const JobCard = ({ job, onJobUpdate, onJobDelete }) => {

    const user = JSON.parse(localStorage.getItem("sheyresume-user"));

    const [visible, setVisible] = useState(false);
    const [editVisible, setEditVisible] = useState(false);
    const [form] = Form.useForm();

    const [loading, setLoading] = useState(false);

    const showModal = () => {
        setVisible(true);
    };

    const handleOk = () => {
        setVisible(false);
    };

    const handleCancel = () => {
        setVisible(false);
    };

    const showEditModal = () => {
        form.setFieldsValue(job);
        setEditVisible(true);
    };

    const handleEditOk = async () => {
        const values = await form.validateFields();
        setLoading(true);
        try {
            const response = await axios.patch(`http://localhost:5000/jobs/${job._id}`, values);
            onJobUpdate(response.data);
            setEditVisible(false);
            setLoading(false);
            message.success('Job updated successfully');
        } catch (err) {
            console.error(err);
            setLoading(false);
            message.error('Failed to update job');
        }
    };

    const handleEditCancel = () => {
        setEditVisible(false);
    };


    const deleteClub = async () => {
        setLoading(true)
        try {
            const response = await axios.delete(`http://localhost:5000/jobs/${job._id}`);
            onJobDelete(response.data._id);
            setEditVisible(false);
            setLoading(false)
            message.success('Job Deleted Successfully');
        } catch (error) {
            console.error(error);
            message.error("Deleting Job Failed");
            setLoading(false)
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
                deleteClub();
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };



    if (loading) {
        return <Spin size='large' />
    }

    return (
        <>
            <Badge.Ribbon text={job.campus} color="red">


                <Card title={job.title} style={{ width: 300, cursor: 'pointer' }}  >
                    {/* <Badge count={job.compus} style={{ position: 'absolute', top: -4, left: -4 }} /> */}
                    <p>Company: {job.company}</p>
                    <p>Location: {job.location}</p>
                    <p>Salary: {job.salary}</p>
                    <p>Description: {job.description}</p>
                    {/* <p>Requirements: {job.requirements.join(', ')}</p> */}
                    <p>Eligibility: {job.eligibility}</p>
                    {/* <p>LinkedIn: <a href={job.linkedin}>Link</a></p> */}
                    {/* <p>Company Website: <a href={job.companyWebsite}>Link</a></p> */}
                    {/* <p>Type: {job.type}</p> */}
                    <p>Posted Date: {new Date(job.postedDate).toLocaleDateString()}</p>

                    <Button onClick={showModal}>Full detail</Button>
                    {user && user.isAdmin ? <Button onClick={showEditModal}>Edit</Button> : null}
                    {user && user.isAdmin ? <Button onClick={confirmDelete}>Delete</Button> : null}
                </Card>
            </Badge.Ribbon>
            <Modal title={job.title} visible={visible} onOk={handleOk} onCancel={handleCancel} footer={[
                <Button key="back" onClick={handleCancel}>
                    Close
                </Button>,
                <Button key="submit" type="primary" onClick={handleOk}>
                    Apply
                </Button>,
            ]}>
                <p>Company: {job.company}</p>
                <p>{job.campus}</p>
                <p>Location: {job.location}</p>
                <p>Salary: {job.salary}</p>
                <p>Description: {job.description}</p>
                <p>Requirements: {job.requirements.join(', ')}</p>
                <p>Eligibility: {job.eligibility}</p>
                <p>LinkedIn: <a href={job.linkedin}>Link</a></p>
                <p>Company Website: <a href={job.companyWebsite}>Link</a></p>
                <p>Type: {job.type}</p>
                <p>Posted Date: {new Date(job.postedDate).toLocaleDateString()}</p>
            </Modal>
            <Modal title={`Edit ${job.title}`} visible={editVisible} onOk={handleEditOk} onCancel={handleEditCancel}>
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

        </>
    )
}
