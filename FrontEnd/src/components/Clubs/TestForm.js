import { useState, React } from 'react';
import { Form, Input, Button, message, Spin } from 'antd';
import { clubAPI } from '../../utils/api';

const { TextArea } = Input;

export const TestForm = () => {
    const [loading, setLoading] = useState(false);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const response = await clubAPI.createClub(values);

            if (response.success) {
                console.log('Club created successfully');
                message.success(response.message || "Club created successfully");
                // Reset form after successful creation
            } else {
                message.error(response.message || "Failed to create club");
            }
        } catch (error) {
            console.error('Error creating club:', error);
            const errorMessage = error.response?.data?.error || 'Failed to create club';
            message.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {loading && <Spin size='large' />}
            <Form
                name="club_form"
                onFinish={onFinish}
                layout="vertical"
                initialValues={{
                    intro: { img: '', a: '', b: '' },
                    content: { head: [], Obs: '', Ach: '', Mem: '', Fac: [], Pres: '', Vicepres: '', Other: [] },
                    Announ: []
                }}
            >
                <Form.Item label="Image" name={['intro', 'img']}>
                    <Input placeholder="Image URL or path" />
                </Form.Item>
                <Form.Item label="A" name={['intro', 'a']}>
                    <Input placeholder="Field A" />
                </Form.Item>
                <Form.Item label="B" name={['intro', 'b']}>
                    <Input placeholder="Field B" />
                </Form.Item>
                <Form.Item label="Head" name={['content', 'head']}>
                    <Input placeholder="Head" />
                </Form.Item>
                <Form.Item label="Observation" name={['content', 'Obs']}>
                    <TextArea rows={4} placeholder="Observation details" />
                </Form.Item>
                <Form.Item label="Achievement" name={['content', 'Ach']}>
                    <TextArea rows={4} placeholder="Achievement details" />
                </Form.Item>
                <Form.Item label="Membership" name={['content', 'Mem']}>
                    <TextArea rows={4} placeholder="Membership details" />
                </Form.Item>
                <Form.Item label="Faculty" name={['content', 'Fac']}>
                    <Input placeholder="Faculty information" />
                </Form.Item>
                <Form.Item label="President" name={['content', 'Pres']}>
                    <Input placeholder="President name" />
                </Form.Item>
                <Form.Item label="Vice President" name={['content', 'Vicepres']}>
                    <Input placeholder="Vice President name" />
                </Form.Item>
                <Form.Item label="Other" name={['content', 'Other']}>
                    <Input placeholder="Other information" />
                </Form.Item>
                <Form.Item label="Announcements" name="Announ">
                    <Input placeholder="Announcements" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Create Club
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};


