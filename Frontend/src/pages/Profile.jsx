import React ,{useEffect, useState} from "react";
import axiosInstance from "../utils/axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { notification, Tooltip } from "antd";
import { useLoading } from "../utils/loader";
import { Card, Button,Form,Input } from "antd";
import {LockOutlined} from '@ant-design/icons';

const Profile = () => {
    const navigate = useNavigate();
    const { showLoading, hideLoading} = useLoading();
    const user  = useSelector((state) => state.user);
    const [userDetails, setUserDetails] = useState({});
    const [step, setStep] = useState(1);

    const onResetPassword = () => {
        showLoading();
        axiosInstance.post("/user/forgot-password",{email:user.email})
        .then((response) => {
            if(response.status === 200){
                notification.success({
                    message: 'Success',
                    description: response.data.message,
                    duration: 3
                });
                setStep(2);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            notification.error({
                message: 'Error',
                description: error.response.data.message, // Use the error message from the response
                duration: 5
            })
        })
        .finally(() => {
            hideLoading();
        })
    }
    const handleResetPassword = (values) => {
    showLoading()
    axiosInstance.post("/user/reset-password", { ...values, email:user.email })
      .then((response) => {
        notification.success({ message: "Password Reset Successful!", description: response.data.message });
        setStep(1); // Reset to initial step
        axiosInstance.get('/user/logout')
        .then((response) => {
          if(response.status === 200){
            navigate('/login');
          }
        })
      })
      .catch((error) => {
        notification.error({ message: "Error", description: error.response.data.message });
      })
      .finally(() => hideLoading());
        
    }


    return (
        <>
        <div className="flex items-center justify-center h-full">
            <div className="flex justify-center items-center h-[80vh] bg-white-100">
               {
                step == 1 ? (

                    <Card className=" shadow-lg rounded-lg p-6 w-[80vw] md:w-[60vw]">
                        <h1 className="text-center pb-4 font-semibold text-3xl">Profile</h1>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-1 text-lg fond-medium"> Name: </div>
                            <div className="col-span-1 text-lg fond-semibold"> {user.name} </div>
                            <div className="col-span-1 text-lg fond-medium"> Email: </div>
                            <Tooltip title={user.email} trigger={window.innerWidth < 640 ? 'click' : 'hover'}>
                                <div className="col-span-1 text-lg fond-semibold truncate"> {user.email}</div>
                            </Tooltip>
                        </div>
                        <div className="my-2 flex justify-center items-center">
                            <Button 
                                type="primary" 
                                className="bg-blue-500 hover:bg-blue-600 w-44"
                                onClick={onResetPassword}
                            >
                            Change Password
                            </Button>
                        </div>
                    </Card>
                ):(
                    <div className=" w-[80vw] md:w-[60vw] flex flex-col justify-center rounded-lg p-4  bg-white">
                        <h1 className="text-center py-4 font-semibold text-3xl my-2">Reset Password</h1>
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
                            <Button type="primary" htmlType="submit" block>Save Password</Button>
                            </Form.Item>
                        </Form>
                    </div>
                    )}
                
            </div>
        </div>
        
        </>
    );
};

export default Profile;