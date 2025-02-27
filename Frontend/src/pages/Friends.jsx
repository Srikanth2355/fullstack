import React,{useState,useEffect} from 'react'
import { Table, Button, Input, Space, notification,Empty, Tabs } from "antd";
import {SearchOutlined, UserAddOutlined, UserDeleteOutlined, UsergroupDeleteOutlined,CheckCircleFilled,CloseCircleOutlined} from '@ant-design/icons';

const Friends = () => {
    const [pendingRequests, setPendingRequests] = useState([]);
    // const [friends, setFriends] = useState([]);
    const [email, setEmail] = useState("");
    const [searchEmail, setSearchEmail] = useState("");
    const [friendRequests, setFriendRequests] = useState([
        { key: 1, name: "John Doe", email: "john@example.com" },
        { key: 2, name: "Jane Smith", email: "jane@example.com" },
        { key: 3, name: "Bob Johnson", email: "bob@example.com" },
        { key: 4, name: "Bob Johnson", email: "bob@example.com" },
        { key: 5, name: "Bob Johnson", email: "bob@example.com" },
        { key: 6, name: "Bob Johnson", email: "bob@example.com" },
        { key: 7, name: "Bob Johnson", email: "bob@example.com" },
        { key: 8, name: "Bob Johnson", email: "bob@example.com" },
        { key: 9, name: "Bob Johnson", email: "bob@example.com" },
        { key: 10, name: "Bob Johnson", email: "bob@example.com" },
      ]);
    
      const [friends, setFriends] = useState([
        { key: 1, name: "Alice Brown", email: "alice@example.com" },
        { key: 2, name: "Bob Johnson", email: "bob@example.com" },
        { key: 3, name: "Bob Johnson", email: "bob@example.com" },
        { key: 4, name: "Bob Johnson", email: "bob@example.com" },
        // { key: 5, name: "Bob Johnson", email: "bob@example.com" },
        // { key: 6, name: "Bob Johnson", email: "bob@example.com" },

      ]);

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
        { title: "Sender Name", dataIndex: "name", key: "name",responsive: ["sm"] },
        { title: "Sender Email", dataIndex: "email", key: "email",responsive: ["sm"] },
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
                                <Input placeholder="Enter friend email" className="flex-1" />
                                <Button type="primary" icon={<UserAddOutlined />}>Send Request</Button>
                            </div>
                            {
                            friends.length ==0 ?(
                                <div className='flex justify-center items-center h-full'>
                                    <Empty description="No friends yet. Try adding some!" />
                                </div>
                            ):(

                                <Table
                                    columns={friendColumns}
                                    dataSource={friends}
                                    pagination={false}
                                    className='overflow-y-auto h-full custom-scrollbar w-full'
                                />
                            )
                            }
                        </div>
                    </div>) 
                },
                {
                    key: "2",
                    label: "Pending Requests",
                    children: (<div className="flex flex-col gap-4 p-1  md:p-4 h-full">
                        <div className="h-[75vh] md:h-[80vh] bg-white pb-3 md:pb-4 rounded-2xl shadow-md flex flex-col overflow-hidden">
                            
                            {
                            friendRequests.length ==0 ?(
                                <div className='flex justify-center items-center h-full'>
                                    <Empty description="No friend requests" />
                                </div>
                        ):(
                            <Table
                                columns={friendRequestColumns}
                                dataSource={friendRequests}
                                pagination={false}
                                className='overflow-y-auto h-full custom-scrollbar w-full'
                            />
                        )
                    }
                        </div>
                    </div>)
                }

            ]}
            />
            
        </>
    )
}

export default Friends