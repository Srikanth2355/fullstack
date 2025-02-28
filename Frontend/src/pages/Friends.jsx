import React,{useState,useEffect} from 'react'
import { Table, Button, Input, Space, notification,Empty, Tabs,Tooltip } from "antd";
import {SearchOutlined, UserAddOutlined, UserDeleteOutlined, UsergroupDeleteOutlined,CheckCircleFilled,CloseCircleOutlined} from '@ant-design/icons';
import axiosInstance from '../utils/axios';
import {useLoading} from '../utils/loader';
const Friends = () => {
    const [pendingRequests, setPendingRequests] = useState([]);
    const {showLoading, hideLoading} = useLoading();
    const [friends, setFriends] = useState([]);
    const [email, setEmail] = useState("");
    const [searchEmail, setSearchEmail] = useState("");
    const [frndRequests, setFrndRequests] = useState([]);
    const friendColumns = [
      {
          title: "Name",
          dataIndex: "name",
          key: "name",
          responsive: ["xs"], // Show only on small screens
          render: (text, record) => (
            <div>
              <p className="font-semibold">{record.name}</p>
              <p className="text-gray-500">{record.email}</p>
            </div>
          ),
        },
      { title: "Friend Name", dataIndex: "name", key: "name",responsive: ["sm"] },
      { title: "Friend Email", dataIndex: "email", key: "email",responsive: ["sm"] },
      {
        title: "Action",
        key: "action",
        render: (_, record) => (
          <Button type='text' danger icon={<UserDeleteOutlined style={{fontSize:"20px"}} />} onClick={() => removeFriend(record.key)} />
        ),
      },
    ];
    const friendRequestColumns = [
        {
            title: "Name & Email",
            dataIndex: "sendername",
            key: "sendername",
            responsive: ["xs"], // Show only on small screens
            render: (text, record) => (
              <div className='flex items-center'>
                <div 
                  className="w-10 h-10 flex items-center justify-center text-white font-bold rounded-full mr-2"
                  style={{ backgroundColor: getRandomPastelColor() }}
                >
                  {text.charAt(0).toUpperCase()}
                </div>
                <div className=''>
                  <p className="font-semibold">{record.sendername}</p>
                  <div className='w-full overflow-hidden max-w-[150px]'>
                      <Tooltip title={record.senderemail} trigger={window.innerWidth < 640 ? 'click' : 'hover'}>
                        <span className="text-gray-500 inline-block text-sm overflow-hidden whitespace-nowrap text-ellipsis !max-w-[150px]  cursor-pointer">
                          {record.senderemail}
                        </span>
                      </Tooltip>
                  </div>
                </div>
              </div>
            ),
          },
        { title: "Name", dataIndex: "sendername", key: "sendername",responsive: ["sm"],
          render: (text, record) => (
            <div className="flex items-center space-x-2">
              <div 
                className="w-10 h-10 flex items-center justify-center text-white font-bold rounded-full"
                style={{ backgroundColor: getRandomPastelColor() }}
              >
                {text.charAt(0).toUpperCase()}
              </div>
              <span className="font-medium">{text}</span>
            </div>
          ),
         },
        { title: "Email", dataIndex: "senderemail", key: "senderemail",responsive: ["sm"] },
        {
          title: "Action",
          key: "action",
          render: (_, record) => (
            <div className="flex gap-2">
                <Button type="text" icon={<CheckCircleFilled className="text-green-500 text-xl" style={{fontSize:"20px"}} />} />
                <Button type="text" icon={<CloseCircleOutlined className="text-red-500 text-xl" style={{fontSize:"20px"}} />} />
              {/* <Button type="primary" icon={<CheckOutlined />} onClick={() => acceptRequest(record.key)}>Accept</Button>
              <Button danger icon={<CloseOutlined />} onClick={() => rejectRequest(record.key)}>Reject</Button> */}
            </div>
          ),
        },
    ];
    const getRandomPastelColor = () => {
      const hue = Math.floor(Math.random() * 360); // Random hue value
      return `hsl(${hue}, 70%, 85%)`; // HSL with high lightness for pastel effect
    };

    const sendFriendRequest = () => {
      showLoading();
      if (email.trim() === "") {
        notification.error({
          message: "Error",
          description: "Please enter a valid email address.",
        });
        hideLoading();
        return;
      }
      // verify if its a valid email 
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        notification.error({
          message: "Error",
          description: "Please enter a valid email address.",
        });
        hideLoading();
        return;
      }

      const existing_frnd = friends.find((friend) => friend.email === email);
      if (existing_frnd) {
        notification.error({
          message: "Error",
          description: "You are already friends with " + existing_frnd.email,
        });
        hideLoading();
        return;
      }
      axiosInstance.post("/friends/addfriend", { email })
        .then((response) => {
        if (response.status === 200) {
          notification.success({
            message: "Success",
            description: response.data.message,
          });
          setEmail("");
        } 
      })
        .catch((error) => {
          console.error("Error:", error);
          notification.error({
            message: "Error",
            description: error.response.data.message,
          });
        })
        .finally(() => {
          hideLoading();
        });
    }
    const getfrndrequests = () => {
      showLoading();
      axiosInstance.get("/friends/getallfriendrequests")
        .then((response) => {
          if (response.status === 200) {
            setFrndRequests(response.data.frndrequests);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        })
        .finally(() => {
          hideLoading();
        });
    }

    useEffect(() => {
      getfrndrequests();
      // getfriends();
    },[])


    return (
        <>
            <Tabs
              defaultActiveKey="1"
              centered
              items={[
                {
                    key: "1",
                    label: "Friends",
                    children: (<div className="flex flex-col gap-4 p-1  md:p-4 h-full">
                        <div  className=" h-[75vh] md:h-[80vh] bg-white py-3 md:py-4 rounded-2xl shadow-md flex flex-col overflow-hidden">
                        <div className="flex items-center gap-2 mb-4 px-3">
                                <Input placeholder="Enter friend email" className="flex-1" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                <Button type="primary" icon={<UserAddOutlined />} disabled={!email} onClick={sendFriendRequest}>Add Friend</Button>
                            </div>
                                <Table
                                    columns={friendColumns}
                                    dataSource={friends}
                                    pagination={false}
                                    locale={{
                                      emptyText: (
                                        <Empty 
                                          image={Empty.PRESENTED_IMAGE_SIMPLE} 
                                          description="No Friends yet! Try adding some."
                                        />
                                      ),
                                    }}
                                    className='overflow-y-auto h-full custom-scrollbar w-full'
                                />
                        </div>
                    </div>) 
                },
                {
                    key: "2",
                    label: "Pending Requests",
                    children: (<div className="flex flex-col gap-4 p-1  md:p-4 h-full">
                        <div className="h-[75vh] md:h-[80vh] bg-white pb-3 md:pb-4 rounded-2xl shadow-md flex flex-col overflow-hidden">
                            <Table
                                columns={friendRequestColumns}
                                dataSource={frndRequests}
                                pagination={false}
                                locale={{
                                  emptyText: (
                                    <Empty 
                                      image={Empty.PRESENTED_IMAGE_SIMPLE} 
                                      description="No Friend Requests!"
                                    />
                                  ),
                                }}
                                className='overflow-y-auto h-full custom-scrollbar w-full'
                            />
                        </div>
                    </div>)
                }

            ]}
            />
            
        </>
    )
}

export default Friends