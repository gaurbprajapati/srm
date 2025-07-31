import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Modal, Form, Input, message, Spin, Row, Col, Card, Avatar } from 'antd';
import { EditOutlined, DeleteOutlined, UserOutlined, TeamOutlined } from '@ant-design/icons';
import { clubAPI, apiUtils } from '../../../utils/api';
import DefaultLayout from '../../DefaultLayout';

export const Clubs = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [form] = Form.useForm();
  const user = apiUtils.getCurrentUser();

  useEffect(() => {
    const fetchClub = async () => {
      setLoading(true);
      try {
        const response = await clubAPI.getClub(id);

        if (response.success) {
          setClub(response.data);
        } else {
          message.error('Club not found');
          navigate('/clubs');
        }
      } catch (error) {
        console.error('Error fetching club:', error);
        message.error('Failed to load club details');
        navigate('/clubs');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchClub();
    }
  }, [id, navigate]);

  const showEditModal = () => {
    form.setFieldsValue(club);
    setEditVisible(true);
  };

  const handleEditOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const response = await clubAPI.updateClub(id, values);

      if (response.success) {
        setClub(response.data);
        setEditVisible(false);
        form.resetFields();
        setLoading(false);
        message.success(response.message || 'Club updated successfully');
      }
    } catch (error) {
      console.error('Error updating club:', error);
      setLoading(false);
      const errorMessage = error.response?.data?.error || 'Failed to update club';
      message.error(errorMessage);
    }
  };

  const handleEditCancel = () => {
    setEditVisible(false);
    form.resetFields();
  };

  const deleteClub = async () => {
    setLoading(true);
    try {
      const response = await clubAPI.deleteClub(id);

      if (response.success) {
        setLoading(false);
        message.success(response.message || 'Club deleted successfully');
        navigate('/clubs');
      }
    } catch (error) {
      console.error('Error deleting club:', error);
      setLoading(false);
      const errorMessage = error.response?.data?.error || 'Failed to delete club';
      message.error(errorMessage);
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
    });
  };

  // Check if current user can edit/delete this club
  const canEdit = user && (user.isAdmin || (club?.createdBy && club.createdBy._id === user._id));

  if (loading && !club) {
    return (
      <DefaultLayout>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
          <p>Loading club details...</p>
        </div>
      </DefaultLayout>
    );
  }

  if (!club) {
    return (
      <DefaultLayout>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <h3>Club not found</h3>
          <Button type="primary" onClick={() => navigate('/clubs')}>
            Back to Clubs
          </Button>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Club Header */}
        <Card style={{ marginBottom: '20px' }}>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} md={6}>
              {club.cover && (
                <img
                  src={`/images/${club.cover}`}
                  alt={club.title}
                  style={{
                    width: '100%',
                    maxWidth: '200px',
                    height: '200px',
                    objectFit: 'cover',
                    borderRadius: '8px'
                  }}
                />
              )}
            </Col>
            <Col xs={24} md={18}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h1 style={{ margin: 0, fontSize: '2.5em' }}>{club.title}</h1>
                  <p style={{ fontSize: '16px', color: '#666', margin: '8px 0' }}>
                    <strong>Category:</strong> {club.category}
                  </p>
                  <p style={{ fontSize: '14px', marginTop: '16px' }}>
                    {club.discription}
                  </p>
                </div>

                {canEdit && (
                  <div>
                    <Button
                      icon={<EditOutlined />}
                      onClick={showEditModal}
                      style={{ marginRight: '8px' }}
                    >
                      Edit
                    </Button>
                    {user.isAdmin && (
                      <Button
                        icon={<DeleteOutlined />}
                        danger
                        onClick={confirmDelete}
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </Col>
          </Row>
        </Card>

        {/* Club Details */}
        <Row gutter={[16, 16]}>
          {/* Leadership */}
          <Col xs={24} md={12}>
            <Card title="Leadership" size="small">
              {club.president && (
                <p><UserOutlined /> <strong>President:</strong> {club.president}</p>
              )}
              {club.vicePresident && (
                <p><UserOutlined /> <strong>Vice President:</strong> {club.vicePresident}</p>
              )}
            </Card>
          </Col>

          {/* Vision/Observation */}
          {club.observation && (
            <Col xs={24} md={12}>
              <Card title="Vision" size="small">
                <p>{club.observation}</p>
              </Card>
            </Col>
          )}

          {/* Members */}
          {club.memberName && club.memberName.length > 0 && (
            <Col xs={24} md={12}>
              <Card title={`Members (${club.memberName.length})`} size="small">
                <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                  {club.memberName.map((member, index) => (
                    <p key={index} style={{ margin: '4px 0' }}>
                      <TeamOutlined /> {member}
                    </p>
                  ))}
                </div>
              </Card>
            </Col>
          )}

          {/* Faculty */}
          {club.facultyName && club.facultyName.length > 0 && (
            <Col xs={24} md={12}>
              <Card title="Faculty Members" size="small">
                {club.facultyName.map((faculty, index) => (
                  <p key={index} style={{ margin: '4px 0' }}>
                    <UserOutlined /> {faculty}
                  </p>
                ))}
              </Card>
            </Col>
          )}

          {/* Achievements */}
          {club.achievement && club.achievement.length > 0 && (
            <Col xs={24}>
              <Card title="Achievements" size="small">
                <ul>
                  {club.achievement.map((achievement, index) => (
                    <li key={index} style={{ marginBottom: '8px' }}>
                      {achievement}
                    </li>
                  ))}
                </ul>
              </Card>
            </Col>
          )}

          {/* Announcements */}
          {club.announcment && club.announcment.length > 0 && (
            <Col xs={24}>
              <Card title="Announcements" size="small">
                {club.announcment.map((announcement, index) => (
                  <div key={index} style={{ marginBottom: '12px', padding: '8px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                    <strong>{announcement.announcmentName}</strong>
                    {announcement.announcmentdate && (
                      <span style={{ float: 'right', color: '#666', fontSize: '12px' }}>
                        {new Date(announcement.announcmentdate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                ))}
              </Card>
            </Col>
          )}

          {/* Social Media */}
          <Col xs={24}>
            <Card title="Connect With Us" size="small">
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                {club.whatup && (
                  <Button type="primary" href={club.whatup} target="_blank">
                    WhatsApp
                  </Button>
                )}
                {club.instagram && (
                  <Button type="primary" href={club.instagram} target="_blank">
                    Instagram
                  </Button>
                )}
                {club.linkedin && (
                  <Button type="primary" href={club.linkedin} target="_blank">
                    LinkedIn
                  </Button>
                )}
                {club.discord && (
                  <Button type="primary" href={club.discord} target="_blank">
                    Discord
                  </Button>
                )}
              </div>
            </Card>
          </Col>
        </Row>

        {/* Back Button */}
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <Button size="large" onClick={() => navigate('/clubs')}>
            Back to All Clubs
          </Button>
        </div>

        {/* Edit Modal */}
        <Modal
          title="Edit Club"
          open={editVisible}
          onOk={handleEditOk}
          onCancel={handleEditCancel}
          width={800}
          confirmLoading={loading}
        >
          <Form form={form} layout="vertical" initialValues={club}>
            <Form.Item
              name="title"
              label="Club Name"
              rules={[{ required: true, message: 'Please enter club name' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="discription"
              label="Description"
              rules={[{ required: true, message: 'Please enter description' }]}
            >
              <Input.TextArea rows={4} />
            </Form.Item>

            <Form.Item name="observation" label="Vision/Mission">
              <Input.TextArea rows={3} />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="president" label="President">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="vicePresident" label="Vice President">
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            {/* Social Media Links */}
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="whatup" label="WhatsApp">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="instagram" label="Instagram">
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="linkedin" label="LinkedIn">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="discord" label="Discord">
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      </div>
    </DefaultLayout>
  );
};
