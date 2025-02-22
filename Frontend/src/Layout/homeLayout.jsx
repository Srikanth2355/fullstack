import React, { Children, useEffect, useState } from 'react';
import { Layout, Menu, notification, theme, Drawer } from 'antd';
import { DeleteOutlined,MenuUnfoldOutlined,MenuFoldOutlined, LogoutOutlined, BookOutlined, ShareAltOutlined, InboxOutlined } from '@ant-design/icons';
import { useNavigate, Outlet,useLocation } from 'react-router-dom';
import { useLoading } from '../utils/loader.jsx';
import axiosInstance from '../utils/axios';

const { Sider } = Layout;

function HomeLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const {showLoading, hideLoading} = useLoading();
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState('1');
  const [opendrawer, setOpendrawer] = useState(false);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

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
      notification.error({
        message: 'Error',
        description: error.response.data.message, // Use the error message from the response
        duration: 5
      })
    })
    .finally(() => {
      hideLoading();
    }); 

  }

  const handleMenuClick = (e) => {
    setSelectedKey(e.key);
    if(e.key === '1'){
      navigate('/notes');
    }else if(e.key === '2'){
      navigate('/sharednotes');
    }else if(e.key === '3'){
      navigate('/sharedwithme');
    }
    setOpendrawer(false);
  };

  useEffect(() => {
    if(location.pathname === '/notes'){
      setSelectedKey('1');
    }else if(location.pathname === '/sharednotes'){
      setSelectedKey('2');
    }else if(location.pathname === '/sharedwithme'){
      setSelectedKey('3');
    }

  },[])

  const items = [
    {
      key: '1',
      label: "Notes",
      icon: <BookOutlined  className='text-sm md:text-md lg:text-xl' />
    },
    {
      key: '2',
      label: "Shared Notes",
      icon: <ShareAltOutlined className='text-sm md:text-md lg:text-xl'  />
    },
    {
      key: '3',
      label: "Shared with me",
      icon: <InboxOutlined className='text-sm md:text-md lg:text-xl' />
    }
    // {
    //   key: '4',
    //   label: "Deleted Notes",
    //   icon: <DeleteOutlined  className='text-sm md:text-md lg:text-xl' />
    // }
  ]
  return (
    <>
    <Layout className='min-h-screen'>
      <Drawer
        title="takenotes"
        placement="left"
        closable={true}
        onClose={() => setOpendrawer(false)}
        open={opendrawer}
        width={250}
        className='hidden md:block relative'
        theme="dark"
        style={{background: '#001529'}}
      >
        <div>
          <Menu theme="dark" mode="vertical" items={items} selectedKeys={[selectedKey]} onClick={handleMenuClick}/>
        </div>
      
        <div className="mb-4 absolute bottom-0 w-full">
          <Menu
            className='text-sm md:text-md'
            theme="dark"
            mode="inline"
            items={[
             {
              key: '5',
              label: "Logout",
              icon: <LogoutOutlined className='text-sm md:text-md lg:text-xl' />,
              onClick: handleLogout
            }]}
          />
        </div>
      </Drawer>
      <Sider
        trigger={null}
        breakpoint="md"
        collapsedWidth="0"
        collapsed={collapsed}
        onBreakpoint={(broken) => {
          setCollapsed(broken);
        }}
        onCollapse={() => setCollapsed(() => !collapsed)}
        className='hidden md:flex flex-col justify-between relative'
        style={{
          height: "100vh",
          position: "fixed", 
          left: 0,
          top: 0,
          bottom: 0,
          overflow: "hidden",
        }}
      >
        <div>
          <div className="demo-logo-vertical mt-2 mb-5 font-semibold text-2xl text-white/65 flex justify-center items-center">takenotes</div> 
          <Menu className='text-sm md:text-md ' theme="dark" mode="inline" selectedKeys={[selectedKey]} items={items} onClick={handleMenuClick} />
        </div>
        <div className="mb-4 absolute bottom-0 w-full">
          <Menu
            className='text-sm md:text-md'
            theme="dark"
            mode="inline"
            items={[
             {
              key: '5',
              label: "Logout",
              icon: <LogoutOutlined className='text-sm md:text-md lg:text-xl' />,
              onClick: handleLogout
            }]}
          />
        </div>
      </Sider>
      <Layout className='min-h-screen md:ml-[200px]'>

          <div className='md:hidden w-full p-2 px-4 flex' style={{background: '#001529',position: 'fixed', zIndex: 1000}}>
            <MenuUnfoldOutlined style={{ fontSize: '20px', color: 'white' }}  onClick={(value) => setOpendrawer(!opendrawer)}/>
            <p className="mx-3 w-full font-semibold text-2xl text-white/65 text-center">takenotes</p> 

          </div>
          <div className='mt-12 md:mt-0 h-[90vh] md:h-[100vh]' style={{
            overflowY: "auto",
            padding: "8px",
          }}>
            <Outlet />
          </div>
      </Layout>
    </Layout>
    </>
  )
}

export default HomeLayout