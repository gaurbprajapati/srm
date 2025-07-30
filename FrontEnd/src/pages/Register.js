import React, { useState, useEffect } from 'react';
import { Button, Form, Input, Spin, message, Avatar, Select, Checkbox } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { UserOutlined, LockOutlined, MailOutlined, HomeOutlined, BankOutlined } from '@ant-design/icons';
import '../resources/authentication.css'
import { authAPI, apiUtils } from '../utils/api';

const { Option } = Select;

function Register() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onfinish = async (values) => {
        setLoading(true);

        try {
            // Remove confirm password from the data sent to API
            const { cpassword, agreeTerms, ...userData } = values;

            const response = await authAPI.register({
                username: userData.username,
                password: userData.password,
                email: userData.email,
                firstName: userData.firstName || '',
                lastName: userData.lastName || ''
            });

            setLoading(false);
            message.success(response.message || "Registration successful");
            navigate('/home');
        } catch (error) {
            console.error('Registration error:', error);

            setLoading(false);
            const errorMessage = error.response?.data?.error || error.message || "Registration failed";
            message.error(errorMessage);
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Form validation failed:', errorInfo);
        message.error('Please fill in all required fields correctly');
    };

    // Redirect to home if already authenticated
    useEffect(() => {
        if (apiUtils.isAuthenticated()) {
            navigate('/home');
        }
    }, [navigate]);

    const testimonials = [
        {
            quote: "Joining Cloud Campus Nexus was the best decision I made in college. I found my study group, got my internship, and built lasting professional relationships.",
            name: "Rahul Gupta",
            role: "Engineering Student",
            company: "SRM University",
            avatar: "RG"
        },
        {
            quote: "The platform's resume builder helped me create a professional profile that caught recruiters' attention. I received multiple job offers before graduation.",
            name: "Ananya Patel",
            role: "Business Student",
            company: "Management Studies",
            avatar: "AP"
        },
        {
            quote: "As a club president, this platform helped us reach more students and organize better events. Our membership grew by 300% in one semester.",
            name: "Vikram Singh",
            role: "Student Leader",
            company: "Photography Club",
            avatar: "VS"
        }
    ];

    const [currentTestimonial, setCurrentTestimonial] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [testimonials.length]);

    return (
        <div className="auth-container">
            {/* Left Side - Testimonials */}
            <div className="auth-left">
                <div className="testimonial-section">
                    <div className="brand-header">
                        <div className="brand-icon">
                            <HomeOutlined />
                        </div>
                        <h1>Cloud Campus Nexus</h1>
                        <p>Connect. Grow. Succeed.</p>
                    </div>

                    <div className="testimonial-content">
                        <div className="quote-icon">"</div>
                        <p className="testimonial-text">
                            {testimonials[currentTestimonial].quote}
                        </p>

                        <div className="testimonial-author">
                            <Avatar size={48} style={{ backgroundColor: '#4F46E5', fontSize: '18px' }}>
                                {testimonials[currentTestimonial].avatar}
                            </Avatar>
                            <div className="author-info">
                                <div className="author-name">{testimonials[currentTestimonial].name}</div>
                                <div className="author-role">{testimonials[currentTestimonial].role}</div>
                                <div className="author-company">{testimonials[currentTestimonial].company}</div>
                            </div>
                        </div>

                        <div className="testimonial-dots">
                            {testimonials.map((_, index) => (
                                <span
                                    key={index}
                                    className={`dot ${index === currentTestimonial ? 'active' : ''}`}
                                    onClick={() => setCurrentTestimonial(index)}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="trusted-by">
                        <p>Trusted by Students in Over 50+ Universities</p>
                        <div className="university-logos">
                            <span>SRM</span>
                            <span>VIT</span>
                            <span>BITS</span>
                            <span>IIT</span>
                            <span>NIT</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Register Form */}
            <div className="auth-right">
                <div className="auth-form-container">
                    <div className="form-header">
                        <h2>Ready to join us? Sign up now</h2>
                        <p>Unlimited access to campus opportunities. No cost required.</p>
                    </div>

                    <Form
                        layout='vertical'
                        onFinish={onfinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                        className="auth-form"
                    >
                        <Form.Item
                            name='firstName'
                            label='Full Name'
                            rules={[
                                { required: true, message: 'Full name is required' },
                                { min: 2, message: 'Name must be at least 2 characters' }
                            ]}
                        >
                            <Input
                                prefix={<UserOutlined />}
                                placeholder="John Doe"
                                size="large"
                            />
                        </Form.Item>

                        <Form.Item
                            name='university'
                            label='University'
                        >
                            <Input
                                prefix={<BankOutlined />}
                                placeholder="SRM University"
                                size="large"
                            />
                        </Form.Item>

                        <Form.Item
                            name='email'
                            label='Email'
                            rules={[
                                { required: true, message: 'Email is required' },
                                { type: 'email', message: 'Please enter a valid email' }
                            ]}
                        >
                            <Input
                                prefix={<MailOutlined />}
                                placeholder="john@example.com"
                                size="large"
                            />
                        </Form.Item>

                        <Form.Item
                            name='username'
                            label='Username'
                            rules={[
                                { required: true, message: 'Username is required' },
                                { min: 3, message: 'Username must be at least 3 characters' }
                            ]}
                        >
                            <Input
                                prefix={<UserOutlined />}
                                placeholder="johndoe123"
                                size="large"
                            />
                        </Form.Item>

                        <Form.Item
                            name='password'
                            label='Password'
                            rules={[
                                { required: true, message: 'Password is required' },
                                { min: 6, message: 'Password must be at least 6 characters' }
                            ]}
                        >
                            <Input.Password
                                prefix={<LockOutlined />}
                                placeholder="+6 characters"
                                size="large"
                            />
                        </Form.Item>

                        <Form.Item
                            name='cpassword'
                            label='Confirm Password'
                            rules={[
                                { required: true, message: 'Please confirm your password' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Passwords do not match'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password
                                prefix={<LockOutlined />}
                                placeholder="Confirm your password"
                                size="large"
                            />
                        </Form.Item>

                        <Form.Item
                            name='yearOfStudy'
                            label='Year of Study'
                        >
                            <Select placeholder="Select Year" size="large">
                                <Option value="1st">1st Year</Option>
                                <Option value="2nd">2nd Year</Option>
                                <Option value="3rd">3rd Year</Option>
                                <Option value="4th">4th Year</Option>
                                <Option value="masters">Masters</Option>
                                <Option value="phd">PhD</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item>
                            <div className="checkbox-group">
                                <Form.Item
                                    name="agreeTerms"
                                    valuePropName="checked"
                                    rules={[
                                        {
                                            validator: (_, value) =>
                                                value ? Promise.resolve() : Promise.reject(new Error('You must agree to the terms'))
                                        }
                                    ]}
                                >
                                    <Checkbox>
                                        I agree to Cloud Campus Nexus's <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link>.
                                    </Checkbox>
                                </Form.Item>

                                <Form.Item name="marketingEmails" valuePropName="checked">
                                    <Checkbox>
                                        I would like to receive updates about new features, events, and opportunities.
                                    </Checkbox>
                                </Form.Item>
                            </div>
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType='submit'
                                loading={loading}
                                block
                                size="large"
                                className="auth-button"
                            >
                                Create your account
                            </Button>
                        </Form.Item>

                        <div className="auth-footer">
                            <span>Already have an Account with Cloud Campus Nexus? </span>
                            <Link to='/login' className="auth-link">
                                Log In
                            </Link>
                        </div>
                    </Form>

                    {loading && (
                        <div className="loading-overlay">
                            <Spin size='large' />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Register;