import React, { useState } from 'react';
import { Form, Input, Button, message, Spin, Select, Row, Col, Typography } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import DefaultLayout from '../DefaultLayout';
import { Navigate } from "react-router-dom";
import { clubAPI } from '../../utils/api';

const { TextArea } = Input;
const { Option } = Select;
const { Title } = Typography;

export const CreateClub = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState(null);
    const [redirect, setRedirect] = useState(false);
    const [clubData, setClubData] = useState(null);

    const onInputChange = (e) => {
        console.log(e.target.files[0]);
        setImage(e.target.files[0]);
    };

    const onFinish = async (values) => {
        if (!image) {
            message.error("Please select an image for the club");
            return;
        }

        const formData = new FormData();
        formData.append("image", image);
        formData.append("title", values.title);
        formData.append("discord", values.discord || '');
        formData.append("linkedin", values.linkedin || '');
        formData.append("instagram", values.instagram || '');
        formData.append("whatup", values.whatup || '');
        formData.append("discription", values.discription);
        formData.append("observation", values.observation || '');
        formData.append("category", values.category);
        formData.append("president", values.president || '');
        formData.append("vicePresident", values.vicePresident || '');

        if (values.memberName) {
            values.memberName.forEach((member, index) => {
                formData.append(`memberName[${index}]`, member);
            });
        }

        if (values.achievement) {
            values.achievement.forEach((achievement, index) => {
                formData.append(`achievement[${index}]`, achievement);
            });
        }

        if (values.announcment) {
            values.announcment.forEach((announcement, index) => {
                Object.entries(announcement).forEach(([key, value]) => {
                    formData.append(`announcment[${index}][${key}]`, value);
                });
            });
        }

        if (values.facultyName) {
            values.facultyName.forEach((facultyName, index) => {
                formData.append(`facultyName[${index}]`, facultyName);
            });
        }

        setLoading(true);
        try {
            const response = await clubAPI.createClub(formData);

            if (response.success) {
                console.log(response.data);
                setClubData(response.data);
                setLoading(false);
                message.success(response.message || "Club Added Successfully");
                setRedirect(true);
            }
        } catch (error) {
            console.error("Error:", error.response?.data?.error);
            setLoading(false);
            const errorMessage = error.response?.data?.error || "Failed to add club";
            message.error(errorMessage);
        }
    };

    if (redirect && clubData) {
        return <Navigate to={`/club/${clubData._id}`} />;
    }

    return (
        <DefaultLayout>
            <Title>Add Your Campus New Club</Title>
            {loading && <Spin size='large' />}

            <Form
                labelCol={{ span: 6 }}
                layout="horizontal"
                form={form}
                onFinish={onFinish}
            >
                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item label="Club Name" name="title" rules={[{ required: true }]}>
                            <Input placeholder="Enter club name" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="Category" name="category" rules={[{ required: true }]}>
                            <Select placeholder="Select category">
                                <Option value="Technical">Technical</Option>
                                <Option value="Sports">Sports</Option>
                                <Option value="Cultural">Cultural</Option>
                                <Option value="Academic">Academic</Option>
                                <Option value="Social">Social</Option>
                                <Option value="Arts">Arts</Option>
                                <Option value="Music">Music</Option>
                                <Option value="Drama">Drama</Option>
                                <Option value="Dance">Dance</Option>
                                <Option value="Literary">Literary</Option>
                                <Option value="Photography">Photography</Option>
                                <Option value="Environment">Environment</Option>
                                <Option value="Volunteer">Volunteer</Option>
                                <Option value="Other">Other</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="Club Image" required>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={onInputChange}
                                style={{ width: '100%' }}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item label="Description" name="discription" rules={[{ required: true }]}>
                    <TextArea
                        rows={4}
                        placeholder="Describe your club's purpose and activities"
                    />
                </Form.Item>

                <Form.Item label="Observation/Vision" name="observation">
                    <TextArea
                        rows={3}
                        placeholder="Club's vision or mission statement"
                    />
                </Form.Item>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="President" name="president">
                            <Input placeholder="President's name" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Vice President" name="vicePresident">
                            <Input placeholder="Vice President's name" />
                        </Form.Item>
                    </Col>
                </Row>

                {/* Dynamic Member Names */}
                <Form.List name="memberName">
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, name, ...restField }) => (
                                <Row key={key} gutter={16} align="middle">
                                    <Col span={20}>
                                        <Form.Item
                                            {...restField}
                                            name={name}
                                            label={`Member ${name + 1}`}
                                        >
                                            <Input placeholder="Member name" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={4}>
                                        <MinusCircleOutlined
                                            onClick={() => remove(name)}
                                            style={{ color: 'red' }}
                                        />
                                    </Col>
                                </Row>
                            ))}
                            <Form.Item>
                                <Button
                                    type="dashed"
                                    onClick={() => add()}
                                    block
                                    icon={<PlusOutlined />}
                                >
                                    Add Member
                                </Button>
                            </Form.Item>
                        </>
                    )}
                </Form.List>

                {/* Dynamic Faculty Names */}
                <Form.List name="facultyName">
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, name, ...restField }) => (
                                <Row key={key} gutter={16} align="middle">
                                    <Col span={20}>
                                        <Form.Item
                                            {...restField}
                                            name={name}
                                            label={`Faculty ${name + 1}`}
                                        >
                                            <Input placeholder="Faculty name" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={4}>
                                        <MinusCircleOutlined
                                            onClick={() => remove(name)}
                                            style={{ color: 'red' }}
                                        />
                                    </Col>
                                </Row>
                            ))}
                            <Form.Item>
                                <Button
                                    type="dashed"
                                    onClick={() => add()}
                                    block
                                    icon={<PlusOutlined />}
                                >
                                    Add Faculty
                                </Button>
                            </Form.Item>
                        </>
                    )}
                </Form.List>

                {/* Dynamic Achievements */}
                <Form.List name="achievement">
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, name, ...restField }) => (
                                <Row key={key} gutter={16} align="middle">
                                    <Col span={20}>
                                        <Form.Item
                                            {...restField}
                                            name={name}
                                            label={`Achievement ${name + 1}`}
                                        >
                                            <Input placeholder="Club achievement" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={4}>
                                        <MinusCircleOutlined
                                            onClick={() => remove(name)}
                                            style={{ color: 'red' }}
                                        />
                                    </Col>
                                </Row>
                            ))}
                            <Form.Item>
                                <Button
                                    type="dashed"
                                    onClick={() => add()}
                                    block
                                    icon={<PlusOutlined />}
                                >
                                    Add Achievement
                                </Button>
                            </Form.Item>
                        </>
                    )}
                </Form.List>

                {/* Social Media Links */}
                <Title level={4}>Social Media Links</Title>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="WhatsApp" name="whatup">
                            <Input placeholder="WhatsApp group link" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Instagram" name="instagram">
                            <Input placeholder="Instagram handle" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="LinkedIn" name="linkedin">
                            <Input placeholder="LinkedIn page" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Discord" name="discord">
                            <Input placeholder="Discord server invite" />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        size="large"
                        loading={loading}
                        style={{ width: '100%' }}
                    >
                        Create Club
                    </Button>
                </Form.Item>
            </Form>
        </DefaultLayout>
    );
};


