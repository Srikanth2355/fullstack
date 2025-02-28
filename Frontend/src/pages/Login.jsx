import React, { useState } from "react";
import { Form, Input, Button, Spin, notification  } from 'antd';
import axiosInstance from "../utils/axios";
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { setUser, clearUser } from "../slice/user";
import { useLoading } from "../utils/loader";
const LoginForm = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const {showLoading, hideLoading} = useLoading();

  const onFinish = (values) => {
    showLoading();
    axiosInstance.post('/user/login',values)
    .then((response) => {
      if(response.status === 200){
        dispatch(setUser(response.data.userdata));
        notification.success({
          message: 'Success',
          description: response.data.message,
          duration: 5
        });
        form.resetFields()
        navigate('/');
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      notification.error({
        message: 'Error',
        description: error.response.data.message, // Use the error message from the response
        duration: 5
      });
    })
    .finally(() => {
      hideLoading();
    });
    
  };

  const onFinishFailed = (errorInfo) => {
    console.error('Form Submission Failed:', errorInfo);
  };

  return (
    <>
      <div className="min-h-screen px-2 flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-extrabold text-gray-700 mb-6 opacity-90">
        thetakenotes
      </h1>
        <div className="bg-white mx-2 p-6 rounded-xl shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-4 ">Login</h1>
          <Form
              form = {form}
              name="login"
              initialValues={{ remember: true }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              layout="vertical"
          >
              {/* Username */}
              <Form.Item
              label="Email"
              name="email"
              rules={[{
                type: 'email',
                message: 'Please enter a valid email!',
              },
              { required: true, message: 'Please input your email!' },
              ]}
              >
              <Input placeholder="Enter your Email" />
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
              <div className="text-right -mt-2">
              <a  onClick={() => navigate('/forgotpassword')} className="text-blue-500 hover:underline">
                  Forgot Password
              </a>
              </div>

              {/* Register Link */}
              <div className="text-center">
              <span>Don't have an account? </span>
              <a onClick={() => navigate('/register')} className="text-blue-500 hover:underline">
                  Register here
              </a>
              </div>
          </Form>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
