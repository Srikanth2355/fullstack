import React from "react";
import { Form, Input, Button } from 'antd';

const LoginForm = () => {
  const onFinish = (values) => {
    console.log('Form Values:', values);
  };

  const onFinishFailed = (errorInfo) => {
    console.error('Form Submission Failed:', errorInfo);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white mx-2 p-6 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-4 ">Login</h1>
        <Form
            name="login"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            layout="vertical"
        >
            {/* Username */}
            <Form.Item
            label="Username"
            name="username"
            rules={[
                { required: true, message: 'Please input your username!' },
            ]}
            >
            <Input placeholder="Enter your username" />
            </Form.Item>

            {/* Password */}
            <Form.Item
            label="Password"
            name="password"
            rules={[
                { required: true, message: 'Please input your password!' },
                { 
                  min: 6, 
                  message: 'Password must be at least 6 characters long.' 
                },
                { 
                  pattern: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z])/,
                  message: 'Password must contain at least one number, one uppercase letter, and one lowercase letter.',
                } 
            ]}
            >
            <Input.Password placeholder="Enter your password" />
            </Form.Item>

            {/* Submit Button */}
            <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full">
                Login
            </Button>
            </Form.Item>

            {/* Register Link */}
            <div className="text-center">
            <span>Don't have an account? </span>
            <a href="/register" className="text-blue-500 hover:underline">
                Register here
            </a>
            </div>
        </Form>
      </div>
  </div>
  );
};

export default LoginForm;
