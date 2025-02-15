import React, {useState} from 'react';
import { Form, Input, Button, Typography,Spin, notification } from 'antd';
import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import axiosInstance from '../utils/axios';
import { Navigate, useNavigate } from 'react-router-dom';
const { Title } = Typography;

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const onFinish = (values) => {
    console.log('Form Values:', values);

    setLoading(true);
    axiosInstance.post('/user/register',values)
    .then((response) => {
      if(response.status === 200){
        notification.success({
          message: 'Success',
          description: response.data.message,
          duration: 3
        });
        form.resetFields()
        navigate('/login');
      }else if(response.status === 400){
        notification.error({
          message: 'Error',
          description: response.data.error, // Use the error message from the response
          duration: 3
        });
      }
      setLoading(false);

    })
    .catch((error) => {
      console.error('Error:', error);
      notification.error({
        message: 'Error',
        description: error.response.data.error, // Use the error message from the response
        duration: 3
      });
      setLoading(false);

    });
    
  };

  return (
    <div
      className="flex items-center justify-center h-screen bg-gray-100"
      style={{ backgroundColor: '#f9f9f9' }} // Light background color
    >
      {
        loading && <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.7)', // Light overlay background
            zIndex: 1000,
          }}
        >
          <Spin size="large" />
        </div>
      }
      <div
        className="p-6 bg-white rounded shadow-md w-full max-w-sm"
        style={{
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Title level={3} className="text-center">
          Register
        </Title>
        <Form
          form = {form}
          name="register"
          onFinish={onFinish}
          layout="vertical"
          initialValues={{ remember: true }}
        >
          {/* Name */}
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please enter your name!' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Enter your name"
            />
          </Form.Item>

          {/* Email */}
          <Form.Item
            name="email"
            label="Email"
            rules={[
              {
                type: 'email',
                message: 'The input is not a valid email!',
              },
              {
                required: true,
                message: 'Please enter your email!',
              },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Enter your email"
            />
          </Form.Item>

          {/* Password */}
          <Form.Item
            name="password"
            label="Password"
            rules={[
              {
                required: true,
                message: 'Please enter your password!',
              },
              {
                min: 6,
                message: 'Password must be at least 6 characters!',
              },
              {
                pattern: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z])/,
                message: 'Password must contain at least one number, one uppercase letter, and one lowercase letter.',
              },
            ]}
            hasFeedback
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Enter your password"
            />
          </Form.Item>

          {/* Confirm Password */}
          <Form.Item
            name="confirm"
            label="Confirm Password"
            dependencies={['password']}
            hasFeedback
            rules={[
              {
                required: true,
                message: 'Please confirm your password!',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error('Password and Confirm Password do not match!')
                  );
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Confirm your password"
            />
          </Form.Item>

          {/* Submit Button */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              style={{ backgroundColor: '#1890ff', borderColor: '#1890ff' }}
            >
              Register
            </Button>
          </Form.Item>

          {/* Redirect to Login */}
          <div className="text-center">
            <span>Already have an account? </span>
            <a href="/login" className="text-blue-500 hover:underline">Login here</a>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Register
