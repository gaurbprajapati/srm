import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useParams } from "react-router-dom";
import DefaultLayout from '../../DefaultLayout'
import './Clubs.css';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Spin, message, Modal } from "antd";
import { Form, Input, Select, Row, Col, DatePicker } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Option } = Select;
const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e && e.fileList;
};


export const Clubs = () => {
  const { id } = useParams();
  const [clubData, setClubData] = useState(null);
  const [loader, setLoader] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const onInputChange = (e) => {
    console.log(e.target.files[0]);
    setImage(e.target.files[0]);
  };
  const user = JSON.parse(localStorage.getItem("sheyresume-user"));

  useEffect(() => {
    const fetchClubsData = async () => {
      setLoader(true)
      try {
        const response = await axios.get(`http://localhost:5000/club/${id}`);
        setClubData(response.data);
        setLoader(false)
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoader(false)
      }
    };

    fetchClubsData();

  }, [id]);



  // useEffect(() => {
  const fetchUpdatedData = async (values) => {
    setLoader(true)
    try {
      const response = await axios.put(`http://localhost:5000/update-club/${id}`, values);
      setClubData(response.data);
      setIsModalVisible(false);
      setLoader(false)
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoader(false)
    }
  };

  useEffect(() => {
    console.log(clubData);
  }, [clubData]);

  // }, [id]);

  const deleteClub = async () => {
    setLoader(true)
    try {
      const response = await axios.delete(`http://localhost:5000/club/${id}`);
      console.log(response.data);
      message.success('Club Deleted Successfully');
      setLoader(false)
      navigate('/clubs');
    } catch (error) {
      console.error(error);
      message.error("Deleting Club Failed");
      setLoader(false)
    }
  };

  const confirmDelete = () => {
    Modal.confirm({
      title: 'Are you sure you want to delete this club?',
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

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };


  if (!clubData) {
    return <Spin size='large' />
  }

  if (loader) {
    return <Spin size='large' />
  }

  const val = true;
  const { title, discription, achievement, president, vicePresident, memberName, facultyName, announcment, cover } = clubData;

  return (

    <DefaultLayout>
      {val ?
        <div style={{ display: 'flex' }}>
          {user && user.isAdmin ? <Button className="editClub-btn" style={{ marginRight: '10px' }} onClick={showModal} >Edit Cubs</Button> : null}
          {user && user.isAdmin ? <Button className="editClub-btn" onClick={confirmDelete}  >Delete Cubs</Button> : null}
        </div>
        : null}


      <div className="main" style={{ backgroundColor: '#EEF7FF' }}>

        <div className="image">
          <div className="intro">
            <div className="i-left">
              <span>Welcome to the</span>
              <span>{title}</span>
              <span>{discription}</span>
            </div>
            <div className="i-right">

              <img src={require(`../../../images/${cover}`)} alt="club cover" width={"350px"} height={"300px"} />
            </div>
          </div>
        </div>


        <div className="box">
          <div className="InnerBox">
            <h1>Observation</h1>
            <p>{clubData.observation}</p>

            <div className="achievement">
              <h1>Achievement</h1>
              <p>{achievement.length}</p>
              {(achievement).map((ach, index) => (
                <p key={index}>{ach}</p>
              ))}
            </div>


            <h1>Members</h1>
            {memberName.map((member, index) => (
              <p key={index}>{member}</p>
            ))}

            <div className="members" style={{ display: 'flex', flexDirection: 'row' }}>
              <div className="student">
                <h3>Student Coordinator</h3>
                <span className="sub-header" style={{ fontSize: '1rem', fontWeight: 'bold' }}>President:-  </span>
                <span>{president}</span>  <br />
                <span className="sub-header" style={{ fontSize: '1rem', fontWeight: 'bold' }}>Vice President:-  </span>
                <span>{vicePresident}</span><br />
                <span className="sub-header" style={{ fontSize: '1rem', fontWeight: 'bold' }}>Club Members:-</span><br />
                {memberName.map((member, index) => (
                  <span key={index}>{member}</span>
                ))}
              </div>
              <div className="facul">
                <span className="sub-header" >Faculty Coordinator</span><br />
                {facultyName.map((faculty, index) => (
                  <span key={index}>{faculty}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="cont">
            {announcment.length >= 1 ? (
              <div className="announce">
                <h3>Announcement</h3>
                {announcment.map((announce, index) => (
                  <div key={index}>
                    <p>{announce.announcmentName} : {new Date(announce.announcmentdate).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            ) : null}
            <br />
            {/* <div className="clubs">
            <h3>Clubs</h3> */}
            {/* Display other clubs except the current one */}
            {/* {prop.Clubs.map((dataa, index) => {
              if (dataa !== title) {
                return <p key={index} className='row'>{dataa}</p>;
              }
            })} */}
            {/* </div> */}
          </div>
        </div>
      </div >


      <Modal width={1200} height={100} title="Edit Club" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Form
          labelCol={{ span: 6 }}
          // wrapperCol={{ span: 18 }}
          layout="horizontal"
          // style={{ maxWidth: 800 }}
          // form={form}
          onFinish={fetchUpdatedData}
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
            // announcment: announcment,
            // announcment: announcment.map(item => ({
            //   announcmentName: item.announcmentName || "",
            //   announcmentdate: item.announcmentdate || ""
            // })),
            achievement: achievement
          }}
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
      </Modal>

    </DefaultLayout>
  );
}
