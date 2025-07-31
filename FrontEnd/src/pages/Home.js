import React from "react";
import DefaultLayout from "../components/DefaultLayout";
import { Link } from 'react-router-dom';
import { Card, Row, Col, Statistic, Button, Progress, Avatar, List } from 'antd';
import {
    UserOutlined,
    TeamOutlined,
    CarryOutOutlined,
    FileTextOutlined,
    ArrowUpOutlined,
    ArrowRightOutlined,
    CalendarOutlined,
    TrophyOutlined,
    BookOutlined
} from '@ant-design/icons';
import '../resources/Home.css';

function Home() {
    // Mock data for dashboard
    const stats = [
        {
            title: 'Active Clubs',
            value: 25,
            precision: 0,
            valueStyle: { color: '#3f8600' },
            prefix: <TeamOutlined />,
            suffix: <ArrowUpOutlined style={{ color: '#3f8600' }} />,
        },
        {
            title: 'Job Opportunities',
            value: 48,
            precision: 0,
            valueStyle: { color: '#1890ff' },
            prefix: <CarryOutOutlined />,
            suffix: <ArrowUpOutlined style={{ color: '#3f8600' }} />,
        },
        {
            title: 'Students Registered',
            value: 1250,
            precision: 0,
            valueStyle: { color: '#722ed1' },
            prefix: <UserOutlined />,
            suffix: <ArrowUpOutlined style={{ color: '#3f8600' }} />,
        },
        {
            title: 'Resume Templates',
            value: 12,
            precision: 0,
            valueStyle: { color: '#eb2f96' },
            prefix: <FileTextOutlined />,
        },
    ];

    const recentActivities = [
        {
            title: 'New coding club "Code Ninjas" created',
            description: 'A new programming club focused on competitive coding',
            time: '2 hours ago',
            avatar: <TeamOutlined style={{ color: '#1890ff' }} />
        },
        {
            title: 'Software Engineer position at TechCorp',
            description: 'New job opportunity for final year students',
            time: '5 hours ago',
            avatar: <CarryOutOutlined style={{ color: '#52c41a' }} />
        },
        {
            title: 'Resume template updated',
            description: 'Modern template design with new layouts',
            time: '1 day ago',
            avatar: <FileTextOutlined style={{ color: '#faad14' }} />
        },
        {
            title: 'Photography club exhibition',
            description: 'Annual photo exhibition scheduled for next week',
            time: '2 days ago',
            avatar: <CalendarOutlined style={{ color: '#722ed1' }} />
        },
    ];

    const quickActions = [
        {
            title: 'Update Profile',
            description: 'Keep your information current',
            icon: <UserOutlined />,
            link: '/profile',
            color: '#1890ff'
        },
        {
            title: 'Browse Clubs',
            description: 'Find clubs that match your interests',
            icon: <TeamOutlined />,
            link: '/clubs',
            color: '#52c41a'
        },
        {
            title: 'Find Jobs',
            description: 'Explore career opportunities',
            icon: <CarryOutOutlined />,
            link: '/jobs',
            color: '#faad14'
        },
        {
            title: 'Create Resume',
            description: 'Build professional resumes',
            icon: <FileTextOutlined />,
            link: '/templates',
            color: '#722ed1'
        },
    ];

    return (
        <DefaultLayout>
            <div className="dashboard-container">
                {/* Welcome Section */}
                <div className="welcome-section">
                    <Row gutter={[24, 24]} align="middle">
                        <Col xs={24} lg={16}>
                            <div className="welcome-content">
                                <h1 className="welcome-title">
                                    Welcome to Cloud Campus Nexus
                                </h1>
                                <p className="welcome-subtitle">
                                    Your gateway to campus opportunities, career development, and networking
                                </p>
                                <div className="welcome-description">
                                    Discover clubs, find job opportunities, build professional profiles,
                                    and connect with like-minded peers in our comprehensive campus ecosystem.
                                </div>
                                <div className="action-buttons">
                                    <Link to="/profile">
                                        <Button type="primary" size="large" icon={<UserOutlined />}>
                                            Complete Profile
                                        </Button>
                                    </Link>
                                    <Link to="/clubs">
                                        <Button size="large" icon={<TeamOutlined />}>
                                            Explore Clubs
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </Col>
                        <Col xs={24} lg={8}>
                            <div className="welcome-image">
                                <div className="dashboard-illustration">
                                    <div className="illustration-card">
                                        <TrophyOutlined style={{ fontSize: '48px', color: '#faad14' }} />
                                        <h3>Achieve Excellence</h3>
                                    </div>
                                    <div className="illustration-card">
                                        <BookOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
                                        <h3>Learn & Grow</h3>
                                    </div>
                                    <div className="illustration-card">
                                        <TeamOutlined style={{ fontSize: '48px', color: '#52c41a' }} />
                                        <h3>Network & Connect</h3>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>

                {/* Statistics Cards */}
                <div className="stats-section">
                    <Row gutter={[24, 24]}>
                        {stats.map((stat, index) => (
                            <Col xs={24} sm={12} lg={6} key={index}>
                                <Card className="stat-card" hoverable>
                                    <Statistic
                                        title={stat.title}
                                        value={stat.value}
                                        precision={stat.precision}
                                        valueStyle={stat.valueStyle}
                                        prefix={stat.prefix}
                                        suffix={stat.suffix}
                                    />
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>

                {/* Main Content */}
                <Row gutter={[24, 24]}>
                    {/* Quick Actions */}
                    <Col xs={24} lg={16}>
                        <Card title="Quick Actions" className="quick-actions-card">
                            <Row gutter={[16, 16]}>
                                {quickActions.map((action, index) => (
                                    <Col xs={24} sm={12} key={index}>
                                        <Link to={action.link}>
                                            <Card
                                                hoverable
                                                className="action-card"
                                                bodyStyle={{ padding: '20px' }}
                                            >
                                                <div className="action-content">
                                                    <div
                                                        className="action-icon"
                                                        style={{ backgroundColor: `${action.color}20`, color: action.color }}
                                                    >
                                                        {action.icon}
                                                    </div>
                                                    <div className="action-text">
                                                        <h4>{action.title}</h4>
                                                        <p>{action.description}</p>
                                                    </div>
                                                    <ArrowRightOutlined className="action-arrow" />
                                                </div>
                                            </Card>
                                        </Link>
                                    </Col>
                                ))}
                            </Row>
                        </Card>
                    </Col>

                    {/* Recent Activities */}
                    <Col xs={24} lg={8}>
                        <Card title="Recent Activities" className="activities-card">
                            <List
                                itemLayout="horizontal"
                                dataSource={recentActivities}
                                renderItem={(item) => (
                                    <List.Item>
                                        <List.Item.Meta
                                            avatar={
                                                <Avatar
                                                    icon={item.avatar}
                                                    style={{ backgroundColor: '#f5f5f5' }}
                                                />
                                            }
                                            title={<span className="activity-title">{item.title}</span>}
                                            description={
                                                <>
                                                    <div className="activity-description">{item.description}</div>
                                                    <div className="activity-time">{item.time}</div>
                                                </>
                                            }
                                        />
                                    </List.Item>
                                )}
                            />
                        </Card>
                    </Col>
                </Row>

                {/* Progress Section */}
                <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
                    <Col xs={24} lg={12}>
                        <Card title="Profile Completion" className="progress-card">
                            <div className="progress-item">
                                <div className="progress-label">
                                    <span>Basic Information</span>
                                    <span>85%</span>
                                </div>
                                <Progress percent={85} strokeColor="#52c41a" />
                            </div>
                            <div className="progress-item">
                                <div className="progress-label">
                                    <span>Skills & Education</span>
                                    <span>60%</span>
                                </div>
                                <Progress percent={60} strokeColor="#1890ff" />
                            </div>
                            <div className="progress-item">
                                <div className="progress-label">
                                    <span>Experience & Projects</span>
                                    <span>40%</span>
                                </div>
                                <Progress percent={40} strokeColor="#faad14" />
                            </div>
                        </Card>
                    </Col>

                    <Col xs={24} lg={12}>
                        <Card title="Campus Engagement" className="engagement-card">
                            <div className="engagement-metric">
                                <TeamOutlined className="engagement-icon" />
                                <div>
                                    <h3>3 Clubs Joined</h3>
                                    <p>Active member in coding, photography, and debate clubs</p>
                                </div>
                            </div>
                            <div className="engagement-metric">
                                <CarryOutOutlined className="engagement-icon" />
                                <div>
                                    <h3>5 Job Applications</h3>
                                    <p>Applied to internships and full-time positions</p>
                                </div>
                            </div>
                            <div className="engagement-metric">
                                <FileTextOutlined className="engagement-icon" />
                                <div>
                                    <h3>2 Resumes Created</h3>
                                    <p>Professional templates for different roles</p>
                                </div>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>
        </DefaultLayout>
    );
}

export default Home;