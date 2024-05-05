import { React, useState } from 'react'
import { Button, Spin, message, Modal } from "antd";
import { Form, Input, Select, Row, Col, DatePicker } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";

const { TextArea } = Input;
const { Option } = Select;
const normFile = (e) => {
    if (Array.isArray(e)) {
        return e;
    }
    return e && e.fileList;
};



export const EditClub = ({ data }) => {
    const { _id, title, discription, achievement, president, vicePresident, memberName, facultyName, announcment, cover } = data;

    // const { id } = useParams();

    const [clubData, setClubData] = useState(null);
    const [loader, setLoader] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const navigate = useNavigate();
    const [image, setImage] = useState(null);
    const onInputChange = (e) => {
        console.log(e.target.files[0]);
        setImage(e.target.files[0]);
    };


    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };


    return (
        <Modal width={1250} height={1000} title="Edit Club" visible={true} onOk={handleOk} onCancel={handleCancel}>
            <Form
                labelCol={{ span: 6 }}
                // wrapperCol={{ span: 18 }}
                layout="horizontal"
                // style={{ maxWidth: 800 }}
                // form={form}
                // onFinish={onFinish}
                initialValues={{
                    title: clubData.title,
                    category: clubData.category,
                    discription: clubData.discription,
                    cover: cover,
                    observation: clubData.observation,
                    president: clubData.president,
                    vicePresident: clubData.vicePresident,
                    whatup: clubData.whatup,
                    instagram: clubData.instagram,
                    linkedin: clubData.linkedin,
                    discord: clubData.discord,
                    memberName: clubData.memberName,
                    facultyName: clubData.facultyName,
                    announcment: clubData.announcment,
                    achievement: Object.values(achievement[0])
                }}
            >
                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item label="Club Name" name="title" rules={[{ required: true }]}>
                            <Input placeholder="Title" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="Club Category" name="category" rules={[{ required: true }]}>
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
                        <Form.Item label="Vice President" name="vicePresident" rules={[{ required: true }]}>
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
                                                    // rules={[{ required: true, message: "Missing faculty member name" }]}
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
                                                    name={[name, "announcment"]}
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
                                            Add Announcment Event
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
                                                    // rules={[{ required: true, message: "Missing faculty member name" }]}
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

                {/* Repeat similar pattern for other Form.List components */}


                <Form.Item>
                    <Button type="primary" htmlType="submit">Submit</Button>
                </Form.Item>
            </Form>
        </Modal>
    )
}
