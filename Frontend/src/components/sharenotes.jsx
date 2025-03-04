import React,{ useState,useEffect, useCallback} from "react";
import { useNavigate } from "react-router-dom";
import { Button, Table, Tooltip,Popconfirm,notification, Typography,Select,Empty, Tag } from "antd";
import { QuestionCircleOutlined, UserDeleteOutlined } from "@ant-design/icons";
import {useLoading} from '../utils/loader';
import axiosInstance from "../utils/axios";
const shareNotes = ({id,getAllSharedNotes,closeModal}) => {
    const { Option } = Select;
    const [selectedFriends, setSelectedFriends] = useState([]);
    const {showLoading, hideLoading} = useLoading();
    const [friendsList,setFriendsList] = useState([]);
    const [availablefriendsList,setAvailablefriendsList] = useState([]);
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
            title={<span className="text-red-500">Revoke Access</span>}
            icon={<QuestionCircleOutlined className="text-red-500 stroke-current" style={{color:"red"}} />}
            placement="topLeft"
            description={"Are you sure to Revoke Access to his note from "+ record.name+" ?"}
            onConfirm={()=>{RemoveAccessToNote(record._id)}}
            onCancel={() => console.log("Cancel")}
            okText="Yes"
            cancelText="No"
          >
            <Button type="text" icon={<UserDeleteOutlined className="text-red-500 text-xl" style={{fontSize:"20px"}}  />} /> 
          </Popconfirm>
          ),
        },
    ];
    const getRandomPastelColor = (index) => {
      const pastelColors = ["#00E0F4", "#F4BEF2", "#CCBEF4"]; 
      return pastelColors[index % pastelColors.length];
    };

    const handleSelectChange = (data) => {
      const parsed_frnds = data.map((val) => JSON.parse(val));
      setSelectedFriends(parsed_frnds);
    };
    // frnds who have access to note
    const getfrndsaccesstonotes = () =>{
      showLoading();
      axiosInstance.get(`/notes/getfrndsaccesstonotes/${id}`)
      .then((response) => {
        if(response.status === 200){
          setFriendsList(response.data.friends);
          if(response.data.friends.length == 0){
            closeModal?.()
          }
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        notification.error({
            message: 'Error',
            description: error.response.data.message,
            duration: 5,
        });
      })
      .finally(() => {
        hideLoading();
      })
    }
   //frnds available to share notes 
    const getavailablefriends = () => {
      showLoading();
      axiosInstance.get("/friends/getallfriends")
      .then((response) => {
        if(response.status === 200){
          let allfrnds = response.data.friends;
          let filteredfrnds = allfrnds.filter((friend)=>{
            return !(friendsList.some((frnd)=>{
              return friend.email === frnd.email
            }))
          })
          console.log(filteredfrnds);
          setAvailablefriendsList(filteredfrnds);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        notification.error({
            message: 'Error',
            description: error.response.data.message,
            duration: 5,
        });
      })
      .finally(() => {
        hideLoading();
      })
    }

    const shareNotes = () => {
      showLoading();
      if(selectedFriends.length == 0){
        notification.error({
            message: 'Error',
            description: "Please select friends",
            duration: 5,
        });
        return;
      }
      axiosInstance.post(`/notes/sharenotes/${id}`,{
        friends:selectedFriends
      })
      .then((response) => {
        if(response.status === 200){
          notification.success({
              message: 'Success',
              description: response.data.message,
              duration: 5,
          });
          setSelectedFriends([]);
          getfrndsaccesstonotes();
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        notification.error({
            message: 'Error',
            description: error.response.data.message,
            duration: 5,
        });
      })
      .finally(() => {
        hideLoading();
      })
    }

    const RemoveAccessToNote = useCallback((frndid) => {
      showLoading();
      axiosInstance.delete(`/notes/removeaccess/${id}/${frndid}`)
      .then((response) => {
        if(response.status === 200){
          notification.success({
              message: 'Success',
              description: response.data.message,
              duration: 5,
          });
          getfrndsaccesstonotes();
          getAllSharedNotes?.()
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        notification.error({
            message: 'Error',
            description: error.response.data.message,
            duration: 5,
        });
      })
      .finally(() => {
        hideLoading();
      })
    })

    useEffect(() => {
      getfrndsaccesstonotes();
    }, []);

    useEffect(() => {
        getavailablefriends();
    }, [friendsList]);
    return (
        <div className="">
            <Typography.Text className="text-md font-semibold mr-2">Select Friends:</Typography.Text> <br />
            <div className="flex items-center">
                <Select
                    mode="multiple" // Enables multi-select
                    className="flex-1 sm:w-[350px] mr-2 mt-2"
                    placeholder="Search and select friends"
                    value={selectedFriends.map((friend) => JSON.stringify(friend))}
                    onChange={handleSelectChange}
                    allowClear
                    maxTagCount={1} // Show only 2 selected items, rest go in dropdown
                    showSearch // Enables search inside the dropdown
                    optionFilterProp="children" // Ensures filtering works on text inside options
                    notFoundContent={<Empty description="Please add friends" />} // Shows message when no options available
                >

                {availablefriendsList.length > 0 ? (
                    availablefriendsList.map((friend) => (
                    <Option key={friend._id} value={JSON.stringify(friend)} disabled={selectedFriends.length >= 5} >
                        {friend.name} ({friend.email})
                    </Option>

                    ))

                ) : null}

                </Select>
                <Button type="primary" shape="round" onClick={shareNotes}>
                  Share
                </Button>
            </div>
            <div className="w-full my-2 rounded-2xl h-[450px] md:h-[300px]">
                <Table
                    columns={friendColumns}
                    dataSource={(friendsList || []).map((request) => ({
                        ...request,
                        key: request._id
                    }))}
                    pagination={false}
                    locale={{
                        emptyText: (
                        <Empty 
                            image={Empty.PRESENTED_IMAGE_SIMPLE} 
                            description="Note has not been shared with anyone."
                        />
                        ),
                    }}
                    className='overflow-y-auto h-full custom-scrollbar w-full'
                />

            </div>
        </div>
    );
};

export default shareNotes;