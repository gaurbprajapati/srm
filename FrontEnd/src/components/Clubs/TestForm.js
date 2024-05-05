import { useState, React } from 'react';
import { Form, Input, Button, message, Spin } from 'antd';
import axios from 'axios';

const { TextArea } = Input;

export const TestForm = () => {
    const [loading, setLoading] = useState(false);
    const onFinish = async (values) => {
        try {
            await axios.post('/create-club', ...values);
            // Handle success
            console.log('Data submitted successfully');
            setLoading(false);
            message.success("Profile Updated Successfull");
        } catch (error) {
            // Handle error
            console.error('Error submitting data:', error);
            setLoading(false);
            message.error("Update failed");
        }
    };

    return (
        <>
            {loading && <Spin size='large' />}
            <Form
                name="club_form"
                onFinish={onFinish}
                initialValues={{
                    intro: { img: '', a: '', b: '' },
                    content: { head: [], Obs: '', Ach: '', Mem: '', Fac: [], Pres: '', Vicepres: '', Other: [] },
                    Announ: []
                }}
            >
                <Form.Item label="Image" name={['intro', 'img']}>
                    <Input />
                </Form.Item>
                <Form.Item label="A" name={['intro', 'a']}>
                    <Input />
                </Form.Item>
                <Form.Item label="B" name={['intro', 'b']}>
                    <Input />
                </Form.Item>
                <Form.Item label="Head" name={['content', 'head']}>
                    <Input />
                </Form.Item>
                <Form.Item label="Observation" name={['content', 'Obs']}>
                    <TextArea rows={4} />
                </Form.Item>
                <Form.Item label="Achievement" name={['content', 'Ach']}>
                    <TextArea rows={4} />
                </Form.Item>
                <Form.Item label="Membership" name={['content', 'Mem']}>
                    <TextArea rows={4} />
                </Form.Item>
                <Form.Item label="Fac" name={['content', 'Fac']}>
                    <Input />
                </Form.Item>
                <Form.Item label="President" name={['content', 'Pres']}>
                    <Input />
                </Form.Item>
                <Form.Item label="Vice President" name={['content', 'Vicepres']}>
                    <Input />
                </Form.Item>
                <Form.Item label="Other" name={['content', 'Other']}>
                    <Input />
                </Form.Item>
                <Form.Item label="Announcements" name="Announ">
                    <Input />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};


