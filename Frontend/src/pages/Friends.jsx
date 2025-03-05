import React,{useState,useEffect,useCallback} from 'react'
import { Table, Button, Input, Space, notification,Empty, Tabs,Tooltip,Popconfirm } from "antd";
import { UserAddOutlined, UserDeleteOutlined, ReloadOutlined ,CheckCircleFilled,CloseCircleOutlined,QuestionCircleOutlined} from '@ant-design/icons';
import axiosInstance from '../utils/axios';
import {useLoading} from '../utils/loader';
const Friends = () => {
    const {showLoading, hideLoading} = useLoading();
    const [email, setEmail] = useState("");
    const [friends, setFriends] = useState([]);
    const [searchfriend, setSearchfriend] = useState("");
    const [filteredfriends, setFilteredfriends] = useState([]);
    const [frndRequests, setFrndRequests] = useState([]);
    const friendColumns = [
      {
          title: "Name",
          dataIndex: "name",
          key: "name",
          responsive: ["xs"], // Show only on small screens
          render: (text, record,index) => (
            <div className='flex items-center'>
                <div 
                  className="w-10 h-10 flex items-center justify-center text-white font-bold rounded-full mr-2"
                  style={{ backgroundColor: getRandomPastelColor(index) }}
                >
                  {text.charAt(0).toUpperCase()}
                </div>
                <div className=''>
                  <p className="font-semibold">{record.name}</p>
                  <div className='w-full overflow-hidden max-w-[150px]'>
                      <Tooltip title={record.email} trigger={window.innerWidth < 640 ? 'click' : 'hover'}>
                        <span className="text-gray-500 inline-block text-sm overflow-hidden whitespace-nowrap text-ellipsis !max-w-[150px]  cursor-pointer">
                          {record.email}
                        </span>
                      </Tooltip>
                  </div>
                </div>
              </div>
          ),
        },
      { title: "Name", dataIndex: "name", key: "name",responsive: ["sm"],
        render: (text, record,index) => (
          <div className="flex items-center space-x-2">
            <div 
              className="w-10 h-10 flex items-center justify-center text-white font-bold rounded-full"
              style={{ backgroundColor: getRandomPastelColor(index) }}
            >
              {text.charAt(0).toUpperCase()}
            </div>
            <span className="font-medium">{text}</span>
          </div>
        ),
       },
      { title: "Email", dataIndex: "email", key: "email",responsive: ["sm"] },
      {
        title: "Action",
        key: "action",
        render: (_, record) => (
          <Popconfirm
          title={<span classNme="text-red-500">Unfriend</span>}
          icon={<QuestionCircleOutlined className="text-red-500" />}
          placement="topLeft"
          description={"Are you sure to Unfriend "+ record.name+" ?"}
          onConfirm={() => removeFriend(record)}
          onCancel={() => console.log("Cancel")}
          okText="Yes"
          cancelText="No"
        >
          <Button type="text" icon={<UserDeleteOutlined className="text-red-500 text-xl" style={{fontSize:"20px"}}  />} /> 
        </Popconfirm>
        ),
      },
    ];
    const friendRequestColumns = [
        {
            title: "Name",
            dataIndex: "sendername",
            key: "sendername",
            responsive: ["xs"], // Show only on small screens
            render: (text, record,index) => (
              <div className='flex items-center'>
                <div 
                  className="w-10 h-10 flex items-center justify-center text-white font-bold rounded-full mr-2"
                  style={{ backgroundColor: getRandomPastelColor(index) }}
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
          render: (text, record,index) => (
            <div className="flex items-center space-x-2">
              <div 
                className="w-10 h-10 flex items-center justify-center text-white font-bold rounded-full"
                style={{ backgroundColor: getRandomPastelColor(index) }}
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
              <Tooltip title="Accept">
                <Button type="text" icon={<CheckCircleFilled className="text-green-500 text-xl" style={{fontSize:"20px"}} onClick={() => acceptRequest(record._id)} />} /> 
              </Tooltip>
              <Tooltip title="Reject">
                <Button type="text" icon={<CloseCircleOutlined className="text-red-500 text-xl" style={{fontSize:"20px"}} onClick={() => rejectRequest(record._id)} />} />
              </Tooltip>
              {/* <Button type="primary" icon={<CheckOutlined />} onClick={() => acceptRequest(record.key)}>Accept</Button>
              <Button danger icon={<CloseOutlined />} onClick={() => rejectRequest(record.key)}>Reject</Button> */}
            </div>
          ),
        },
    ];
    const getRandomPastelColor = (index) => {
      const pastelColors = ["#00E0F4", "#F4BEF2", "#CCBEF4"]; 
      return pastelColors[index % pastelColors.length];
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

    const acceptRequest = useCallback((id) => {
      showLoading();
      axiosInstance.post("/friends/acceptfriendrequest", { id })
        .then((response) => {
          if (response.status === 200) {
            notification.success({
              message: "Success",
              description: response.data.message,
            });
            getfrndrequests();
            getfriends();
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
    })

    const rejectRequest = useCallback((id) => {
      showLoading();
      axiosInstance.post("/friends/rejectfriendrequest", { id })
        .then((response) => {
          if (response.status === 200) {
            notification.success({
              message: "Success",
              description: response.data.message,
            });
            getfrndrequests();
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
    })

    const getfriends = () => {
      showLoading();
      axiosInstance.get("/friends/getallfriends")
        .then((response) => {
          if (response.status === 200) {
            setFriends(response.data.friends);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        })
        .finally(() => {
          hideLoading();
        });
    }

    const removeFriend = useCallback((record) => {
      showLoading();
      axiosInstance.post("/friends/removefriend", { id: record._id, email: record.email })
        .then((response) => {
          if (response.status === 200) {
            notification.success({
              message: "Success",
              description: response.data.message,
            });
            getfrndrequests();
            getfriends();
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
        })
    })

    useEffect(() => {
      getfrndrequests();
      getfriends();
    },[])

    useEffect(() => {
      // Filter friends based on searc
      const filtered = friends.filter((friend) =>
        friend.name.toLowerCase().includes(searchfriend.toLowerCase()) ||
        friend.email.toLowerCase().includes(searchfriend.toLowerCase())
      );
      setFilteredfriends(filtered);
    }, [searchfriend, friends]);


    return (
        <>
            <Tabs
              defaultActiveKey="1"
              centered
              items={[
                {
                    key: "1",
                    label: "Friends",
                    children: (<div className="flex flex-col gap-2 p-1  md:p-4 h-full">
                        <div className="flex items-center">
                            <Input placeholder="Enter friend email" className="flex-1 mr-2" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                            <Button type="primary" icon={<UserAddOutlined />} disabled={!email} onClick={sendFriendRequest}>Add Friend</Button>
                        </div>
                        <div className='flex items-center justify-between my-2'>
                        <Input
                          placeholder="Search Friends by name or email" 
                          value={searchfriend}
                          allowClear 
                          onChange={(e) => setSearchfriend(e.target.value)}
                          className="w-full md:w-1/2 lg:w-1/3 mr-2"
                        />
                        
                        <Button color="primary" variant='outlined' shape="round" icon={<ReloadOutlined /> } onClick={() => {getfriends(); getfrndrequests()}} >
                          Refresh data
                          </Button>

                        </div>
                        <div  className=" h-[65vh] md:h-[70vh] bg-white  rounded-2xl shadow-md flex flex-col overflow-hidden">
                                <Table
                                    columns={friendColumns}
                                    dataSource={filteredfriends.map((request) => ({
                                      ...request,
                                      key: request._id
                                    }))}
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
                    label: "Friend Requests",
                    children: (<div className="flex flex-col gap-4 p-1  md:p-4 h-full">
                        <div className='flex items-center justify-end'>

                        <Button color="primary" variant='outlined' shape="round" icon={<ReloadOutlined /> } onClick={() => {getfriends(); getfrndrequests()}} >
                            Refresh data
                            </Button>
                        </div>
                        <div className="h-[70vh] md:h-[75vh] bg-white pb-3 md:pb-4 rounded-2xl shadow-md flex flex-col overflow-hidden">
                            <Table
                                columns={friendRequestColumns}
                                dataSource={frndRequests.map((request) => ({
                                  ...request,
                                  key: request._id
                                }))}
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