import React, { useState } from "react";
import { Form, Input, Button, Typography, notification } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import axiosInstance from "../utils/axios";
import {useLoading} from '../utils/loader';
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";


const { Title } = Typography;

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // Step 1: Enter Email, Step 2: Enter OTP & New Password
  const [email, setEmail] = useState("");
  const {showLoading, hideLoading} = useLoading();

  const handleSendOTP = (values) => {
    showLoading()
    axiosInstance.post("/user/forgot-password", values)
      .then((response) => {
        notification.success({ message: "OTP Sent!", description: response.data.message });
        setEmail(values.email); // Store email for next step
        setStep(2);
      })
      .catch((error) => {
        notification.error({ message: "Error", description: error.response.data.error });
      })
      .finally(() => hideLoading());
  };

  const handleResetPassword = (values) => {
    showLoading()
    axiosInstance.post("/user/reset-password", { ...values, email })
      .then((response) => {
        notification.success({ message: "Password Reset!", description: response.data.message });
        setStep(1); // Reset to initial step
        navigate('/login');
      })
      .catch((error) => {
        notification.error({ message: "Error", description: error.response.data.error });
      })
      .finally(() => hideLoading());
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="p-6 bg-white rounded shadow-md w-full max-w-sm">
        <Title level={3} className="text-center">
          {step === 1 ? "Forgot Password" : "Reset Password"}
        </Title>

        {step === 1 ? (
          <Form onFinish={handleSendOTP} layout="vertical">
            <Form.Item name="email" label="Email" rules={[{ required: true, type: "email", message: "Enter a valid email!" }]}>
              <Input prefix={<MailOutlined />} placeholder="Enter your email" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block>Send OTP</Button>
            </Form.Item>
          </Form>
        ) : (
          <Form onFinish={handleResetPassword} layout="vertical">
            <Form.Item name="otp" label="OTP" rules={[{ required: true, message: "Enter the OTP sent to your email!" }]}>
              <Input placeholder="Enter OTP" />
            </Form.Item>
            <Form.Item name="password" label="New Password" rules={[
              { required: true, message: "Enter your new password!" },
              { min: 6, message: "Password must be at least 6 characters!" },
              { 
                pattern: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z])/,
                message: 'Password must contain at least one Number, one Uppercase letter, and one Lowercase letter.',
                } 
            ]}>
              <Input.Password prefix={<LockOutlined />} placeholder="Enter new password" />
            </Form.Item>
            <Form.Item name="confirm" label="Confirm Password" dependencies={["password"]} rules={[
              { required: true, message: "Confirm your password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  return value && getFieldValue("password") === value ? Promise.resolve() : Promise.reject(new Error("Passwords do not match!"));
                },
              }),
            ]}>
              <Input.Password prefix={<LockOutlined />} placeholder="Confirm password" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block>Reset Password</Button>
            </Form.Item>
          </Form>
        )}

        <div className="text-center mt-4">
          <a href="/login" className="text-blue-500 hover:underline">Back to Login</a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
