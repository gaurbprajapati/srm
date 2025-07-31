import React, { useState, useEffect } from 'react'
import DefaultLayout from '../components/DefaultLayout'
import { Tabs, Form, Button, Spin, message } from 'antd'
import PersonalInfo from '../components/PersonalInfo';
import SkillsEducation from '../components/SkillsEducation';
import ExperienceProjects from '../components/ExperienceProjects';
import { authAPI, apiUtils } from '../utils/api';

function Profile() {
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);
    const [form] = Form.useForm();

    // Load user data on component mount
    useEffect(() => {
        const loadUserData = async () => {
            try {
                setLoading(true);
                const response = await authAPI.getProfile();
                if (response.success) {
                    setUser(response.data);
                    form.setFieldsValue(response.data);
                }
            } catch (error) {
                // Fallback to localStorage if API fails
                const localUser = apiUtils.getCurrentUser();
                if (localUser) {
                    setUser(localUser);
                    form.setFieldsValue(localUser);
                }
            } finally {
                setLoading(false);
            }
        };

        loadUserData();
    }, [form]);

    const onfinish = async (values) => {
        setLoading(true);
        try {
            const response = await authAPI.updateProfile(values);

            if (response.success) {
                setUser(response.data);
                setLoading(false);
                message.success(response.message || "Profile Updated Successfully");
            }
        } catch (error) {
            setLoading(false);
            const errorMessage = error.response?.data?.error || "Update failed";
            message.error(errorMessage);
        }
    };

    if (!user) {
        return (
            <DefaultLayout>
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <Spin size='large' />
                    <p>Loading profile...</p>
                </div>
            </DefaultLayout>
        );
    }

    return (
        <>
            <DefaultLayout>
                {loading && <Spin size='large' />}
                <div className="update-profile">
                    <h4><b>Update Profile</b></h4>
                    <hr />
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onfinish}
                        initialValues={user}
                    >
                        <Tabs defaultActiveKey="1">
                            <Tabs.TabPane tab="Personal Info" key="1">
                                <PersonalInfo />
                            </Tabs.TabPane>
                            <Tabs.TabPane tab="Skills and Education" key="2">
                                <SkillsEducation />
                            </Tabs.TabPane>
                            <Tabs.TabPane tab="Experience / Projects" key="3">
                                <ExperienceProjects />
                            </Tabs.TabPane>
                        </Tabs>

                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            style={{ marginTop: '20px' }}
                        >
                            UPDATE PROFILE
                        </Button>
                    </Form>
                </div>
            </DefaultLayout>
        </>
    )
}

export default Profile

