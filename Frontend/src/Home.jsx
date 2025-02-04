import React, { Children } from 'react';
import { Layout, Menu, Avatar, Dropdown, Space, notification } from 'antd';
import { UserOutlined, LogoutOutlined, DownOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useLoading } from './utils/loader.jsx';
import axiosInstance from './utils/axios';
import { useSelector } from 'react-redux';

const { Header } = Layout;

function Home() {
  const navigate = useNavigate();
  const {showLoading, hideLoading} = useLoading();
  const user = useSelector((state) => state.user);

  const handleLogout = () => {
    showLoading();
      axiosInstance.get('/user/logout')
      .then((response) => {
        if(response.status === 200){
          navigate('/login');
          notification.success({
            message: 'Success',
            description: "Logout Successfull",
            duration: 3
          });
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      })
      .finally(() => {
        hideLoading();
      }); 

  }
  return (
    <>
      <Header className="bg-white p-0"> 
        <div className="flex items-center px-6"> 
          <div className="flex-1"> 
            <p className='text-2xl font-semibold'>Logo</p>
          </div>
          <div className="flex items-center space-x-4"> 
            <Dropdown menu={{ items: [{ key: '1', label: <p className='flex justify-between' onClick={handleLogout}><span>Logout</span> <LogoutOutlined /></p> }] }}>
              <a onClick={(e) => e.preventDefault()}>
                <Space>
                  <Avatar size="medium" icon={<UserOutlined />} />
                  {user.name} <DownOutlined />
                </Space>
              </a>
            </Dropdown>
          </div>
        </div>
      </Header>
    </>
  )
}

export default Home