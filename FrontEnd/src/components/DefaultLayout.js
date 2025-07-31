import React, { useState } from 'react';
import '../resources/defaultlayout.css';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button, Dropdown, Avatar, message, Badge } from 'antd';
import {
    UserOutlined,
    LogoutOutlined,
    ProfileOutlined,
    SettingOutlined,
    HomeOutlined,
    TeamOutlined,
    CarryOutOutlined,
    FileTextOutlined,
    BankOutlined,
    DashboardOutlined,
    PlusCircleOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    BellOutlined
} from '@ant-design/icons';
import { authAPI, apiUtils } from '../utils/api';

function DefaultLayout(props) {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const user = apiUtils.getCurrentUser();

    const handleLogout = async () => {
        try {
            await authAPI.logout();
            message.success('Logged out successfully');
            navigate('/login');
        } catch (error) {
            apiUtils.clearAuth();
            message.success('Logged out successfully');
            navigate('/login');
        }
    };

    const userMenuItems = [
        {
            key: 'profile',
            icon: <ProfileOutlined />,
            label: 'Profile',
            onClick: () => navigate('/profile')
        },
        {
            key: 'settings',
            icon: <SettingOutlined />,
            label: 'Settings'
        },
        {
            type: 'divider'
        },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: 'Logout',
            onClick: handleLogout
        }
    ];

    const menuItems = [
        {
            key: '/home',
            icon: <DashboardOutlined />,
            label: 'Dashboard',
            path: '/home'
        },
        {
            key: '/profile',
            icon: <UserOutlined />,
            label: 'Profile',
            path: '/profile'
        },
        {
            key: '/clubs',
            icon: <TeamOutlined />,
            label: 'Clubs',
            path: '/clubs'
        },
        {
            key: '/jobs',
            icon: <CarryOutOutlined />,
            label: 'Jobs',
            path: '/jobs'
        },
        {
            key: '/oncampusjobs',
            icon: <BankOutlined />,
            label: 'Campus Jobs',
            path: '/oncampusjobs'
        },
        {
            key: '/templates',
            icon: <FileTextOutlined />,
            label: 'Templates',
            path: '/templates'
        }
    ];

    const adminMenuItems = [
        {
            key: '/CreateClub',
            icon: <PlusCircleOutlined />,
            label: 'Add Club',
            path: '/CreateClub'
        }
    ];

    const isActiveRoute = (path) => {
        return location.pathname === path || location.pathname.startsWith(path);
    };

    return (
        <div className="modern-layout">
            {/* Sidebar */}
            <div className={`modern-sidebar ${collapsed ? 'collapsed' : ''}`}>
                {/* Logo Section */}
                <div className="sidebar-logo">
                    <div className="logo-icon">
                        <HomeOutlined />
                    </div>
                    {!collapsed && (
                        <div className="logo-text">
                            <h2>Campus Nexus</h2>
                            <span>Professional Hub</span>
                        </div>
                    )}
                </div>

                {/* Navigation Menu */}
                <div className="sidebar-menu">
                    {menuItems.map((item) => (
                        <Link
                            key={item.key}
                            to={item.path}
                            className={`menu-item ${isActiveRoute(item.path) ? 'active' : ''}`}
                            title={collapsed ? item.label : ''}
                        >
                            <div className="menu-icon">{item.icon}</div>
                            {!collapsed && <span className="menu-label">{item.label}</span>}
                        </Link>
                    ))}

                    {/* Admin Section */}
                    {user && user.isAdmin && (
                        <>
                            <div className="menu-divider"></div>
                            {!collapsed && <div className="menu-section-title">Admin Panel</div>}
                            {adminMenuItems.map((item) => (
                                <Link
                                    key={item.key}
                                    to={item.path}
                                    className={`menu-item ${isActiveRoute(item.path) ? 'active' : ''}`}
                                    title={collapsed ? item.label : ''}
                                >
                                    <div className="menu-icon">{item.icon}</div>
                                    {!collapsed && <span className="menu-label">{item.label}</span>}
                                </Link>
                            ))}
                        </>
                    )}
                </div>

                {/* User Profile Section */}
                <div className="sidebar-footer">
                    {!collapsed && user && (
                        <div className="user-profile">
                            <Avatar
                                icon={<UserOutlined />}
                                style={{ backgroundColor: '#4F46E5' }}
                            />
                            <div className="user-info">
                                <div className="user-name">{user.firstName || user.username}</div>
                                <div className="user-role">{user.isAdmin ? 'Administrator' : 'Student'}</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="modern-main">
                {/* Top Header */}
                <div className="modern-header">
                    <div className="header-left">
                        <Button
                            type="text"
                            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                            onClick={() => setCollapsed(!collapsed)}
                            className="sidebar-toggle"
                        />
                        <div className="page-title">
                            <h1>Welcome to Cloud Campus Nexus</h1>
                            <span>Your gateway to campus opportunities</span>
                        </div>
                    </div>

                    <div className="header-right">
                        <div className="header-actions">
                            <Badge count={3} size="small">
                                <Button
                                    type="text"
                                    icon={<BellOutlined />}
                                    className="notification-btn"
                                />
                            </Badge>

                            {user ? (
                                <div className="user-menu">
                                    <span className="welcome-text">
                                        {user.firstName || user.username}
                                    </span>
                                    {user.isAdmin && (
                                        <Badge
                                            text="Admin"
                                            color="#f50"
                                            style={{ marginLeft: '8px' }}
                                        />
                                    )}
                                    <Dropdown
                                        menu={{ items: userMenuItems }}
                                        placement="bottomRight"
                                        trigger={['click']}
                                    >
                                        <Avatar
                                            icon={<UserOutlined />}
                                            style={{
                                                cursor: 'pointer',
                                                backgroundColor: '#4F46E5',
                                                marginLeft: '12px'
                                            }}
                                        />
                                    </Dropdown>
                                </div>
                            ) : (
                                <Button type="primary" onClick={() => navigate('/login')}>
                                    Login
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="modern-content">
                    {props.children}
                </div>
            </div>
        </div>
    );
}

export default DefaultLayout;