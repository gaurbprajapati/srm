import React, { useState } from 'react';
import { Form, Input, Button, Upload, message, Spin, Select, DatePicker, Row, Col } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import DefaultLayout from '../DefaultLayout';
import { Navigate } from "react-router-dom";
const { TextArea } = Input;
const { Option } = Select;
const normFile = (e) => {
    if (Array.isArray(e)) {
        return e;
    }
    return e && e.fileList;
};

export const CreateClub = () => {
    const [form] = Form.useForm();
    // const [componentDisabled, setComponentDisabled] = useState(true);
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState(null);
    const [redirect, setRedirect] = useState(false);
    const [clubData, setClubData] = useState(null);
    const onInputChange = (e) => {
        console.log(e.target.files[0]);
        setImage(e.target.files[0]);
    };

    const onFinish = async (values) => {
        const formData = new FormData();
        formData.append("image", image);
        formData.append("title", values.title);
        formData.append("discord", values.discord);
        formData.append("linkedin", values.linkedin);
        formData.append("instagram", values.instagram);
        formData.append("whatup", values.whatup);
        formData.append("discription", values.discription);
        formData.append("observation", values.observation);
        formData.append("category", values.category);
        formData.append("president", values.president);
        formData.append("vicePresident", values.vicePresident);
        values.memberName?.forEach((member, index) => {
            formData.append(`memberName[${index}]`, member);
        });
        values.achievement.forEach((achievement, index) => {
            formData.append(`achievement[${index}]`, achievement);
        });
        values.announcment?.forEach((announcement, index) => {
            Object.entries(announcement).forEach(([key, value]) => {
                formData.append(`announcment[${index}][${key}]`, value);
            });
        });
        values.facultyName?.forEach((facultyName, index) => {
            formData.append(`facultyName[${index}]`, facultyName);
        });
        setLoading(true);
        try {
            const result = await axios.post("http://localhost:5000/create-club", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log(result.data);
            setClubData(result.data);
            setLoading(false);
            message.success("Club Added Successfull");
            setRedirect(true);
        } catch (error) {
            console.error("Error:", error.response.data.error);
            setLoading(false);
            message.error("Failed to add club");
        }
    };

    if (redirect) {
        return <Navigate to={`/club/${clubData._id}`} />;
    }
    // if (clubData) {
    //     return <Spin size='large' />
    // }
    return (

        <DefaultLayout>
            {loading && <Spin size='large' />}

            <Form
                labelCol={{ span: 6 }}
                // wrapperCol={{ span: 18 }}
                layout="horizontal"
                // style={{ maxWidth: 800 }}
                form={form}
                onFinish={onFinish}
            >
                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item label="Club Name" name="title" rules={[{ required: true }]}>
                            <Input placeholder="Title" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="Category" name="category" rules={[{ required: true }]}>
                            <Select placeholder="Select categories">
                                <Option value="Sports">Sports</Option>
                                <Option value="Education">Education</Option>
                                <Option value="Cultural">Cultural</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="Description" name="discription" rules={[{ required: true }]}>
                            <TextArea rows={1} placeholder="Description" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item label="Club Logo" name="upload" valuePropName="fileList" getValueFromEvent={normFile}>
                            <input type="file" accept="image/*" onChange={onInputChange}></input>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="Observation" name="observation">
                            <TextArea rows={1} placeholder="Observation" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="President" name="president" rules={[{ required: true }]}>
                            <Input placeholder="President" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item label="VicePresident" name="vicePresident" rules={[{ required: true }]}>
                            <Input placeholder="Vice President" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="WhatUp" name="whatup">
                            <Input placeholder="WhatUp Url" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="Instagram" name="instagram">
                            <Input placeholder="Instagram Url" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item label="Linkedin" name="linkedin">
                            <Input placeholder="Linkedin Url" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="Discord" name="discord">
                            <Input placeholder="Discord Url" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={8}>
                        <Form.List name="memberName">
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map(({ key, name }) => (
                                        <Row gutter={16} key={key}>
                                            <Col span={16}>
                                                <Form.Item
                                                    name={name}
                                                    rules={[{ required: true, message: "Missing member name" }]}
                                                >
                                                    <Input placeholder="Member Name" />
                                                </Form.Item>
                                            </Col>
                                            <Col span={4}>
                                                <MinusCircleOutlined style={{ fontSize: 25, color: 'tomato', marginTop: 8 }} onClick={() => remove(name)} />
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
                                            Add Club Member
                                        </Button>
                                    </Form.Item>
                                </>
                            )}
                        </Form.List>
                    </Col>

                    <Col span={8}>
                        <Form.List name="facultyName">
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map(({ key, name }) => (
                                        <Row gutter={16} key={key}>
                                            <Col span={16}>
                                                <Form.Item
                                                    name={name}
                                                    rules={[{ required: true, message: "Missing faculty member name" }]}
                                                    style={{ marginBottom: 0 }}
                                                >
                                                    <Input placeholder="Faculty Member" />
                                                </Form.Item>
                                            </Col>
                                            <Col span={4}>
                                                <MinusCircleOutlined style={{ fontSize: 25, color: 'tomato', marginTop: 8 }} onClick={() => remove(name)} />
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
                                            Add Faculty Member
                                        </Button>
                                    </Form.Item>
                                </>
                            )}
                        </Form.List>
                    </Col>
                </Row>


                <Row gutter={16}>
                    <Col span={8}>
                        <Form.List name="announcment">
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map(({ key, name, ...restField }) => (
                                        <Row gutter={16} key={key}>
                                            <Col span={20}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, "announcmentName"]}
                                                    rules={[{ required: true, message: "Missing announcment" }]}
                                                    style={{ marginBottom: 0 }}
                                                >
                                                    <Input placeholder="Club Announcment" style={{ width: 'calc(100% - 20px)' }} />
                                                </Form.Item>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, "announcmentdate"]}
                                                // rules={[{ required: true, message: "Missing date" }]}
                                                >
                                                    <DatePicker placeholder="Select Date" />
                                                </Form.Item>
                                            </Col>
                                            <Col span={4}>
                                                <MinusCircleOutlined style={{ fontSize: 25, color: 'tomato', marginTop: 8 }} onClick={() => remove(name)} />
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
                                            Add Announcement
                                        </Button>
                                    </Form.Item>
                                </>
                            )}
                        </Form.List>
                    </Col>


                    <Col span={8}>
                        <Form.List name="achievement">
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map(({ key, name }) => (
                                        <Row gutter={16} key={key}>
                                            <Col span={16}>
                                                <Form.Item
                                                    name={name}
                                                    rules={[{ required: true, message: "Missing Achievement" }]}
                                                    style={{ marginBottom: 0 }}
                                                >
                                                    <Input placeholder="Achievement Member" />
                                                </Form.Item>
                                            </Col>
                                            <Col span={4}>
                                                <MinusCircleOutlined style={{ fontSize: 25, color: 'tomato', marginTop: 8 }} onClick={() => remove(name)} />
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
                                            Add Club Achievement
                                        </Button>
                                    </Form.Item>
                                </>
                            )}
                        </Form.List>
                    </Col>



                </Row>
                <Form.Item>
                    <Button type="primary" htmlType="submit">Submit</Button>
                </Form.Item>
            </Form>
        </DefaultLayout >



    );
};


