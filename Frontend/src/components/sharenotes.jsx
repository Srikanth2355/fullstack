import React,{ useState,useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { Button, Table, Tooltip,Popconfirm,notification, Typography,Select,Empty, Tag } from "antd";
import { QuestionCircleOutlined, UserDeleteOutlined } from "@ant-design/icons";
const shareNotes = ({id}) => {
    const { Option } = Select;
    const [selectedFriends, setSelectedFriends] = useState([]);
    const friendColumns = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
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
    const getRandomPastelColor = () => {
        const hue = Math.floor(Math.random() * 360); 
        return `hsl(${hue}, 70%, 85%)`;
    };

    const availablefriendsList = [
        { id: 1, name: "John Doe", email: "johwn@example.com" },
        { id: 2, name: "Jane Smith", email: "janxe@example.com" },
        { id: 3, name: "Alice Brown", email: "alirce@example.com" },
        { id: 4, name: "John Doe", email: "john@example.com" },
        { id: 5, name: "Jane Smith", email: "janwe@example.com" },
        { id: 6, name: "Alicexyz dfr Brown", email: "aliwce@example.com" },
        { id: 7, name: "Alice Brown", email: "aliece@example.com" },
        { id: 8, name: "John Doe", email: "johxn@example.com" },
        { id: 9, name: "Jane Smith", email: "jane@example.com" },
        { id: 10, name: "Alice Brown", email: "alicess@example.com" },
    
    ];
    const friendsList = [

        { id: 1, name: "John Doe", email: "john@example.com" },
    
        { id: 2, name: "Jane Smith", email: "jane@example.com" },
    
        { id: 3, name: "Alice Brown", email: "alice@example.com" },
        { id: 4, name: "John Doe", email: "john@example.com" },
    
        { id: 5, name: "Jane Smith", email: "jane@example.com" },
    
        { id: 6, name: "Alice Brown", email: "alice@example.com" },
    
    ];

    const handleSelectChange = (data) => {
        const parsed_frnds = data.map((val) => JSON.parse(val));
        setSelectedFriends(parsed_frnds);
    
      };
    return (
        <div className="">
            <Typography.Text className="text-md font-semibold mr-2">Select Friends:</Typography.Text> <br />
            <div>

                <Select
                    mode="multiple" // Enables multi-select
                    className="w-[150px] sm:w-[350px] mr-2 mt-2"
                    placeholder={friendsList.length === 0 ? "Please add friends" : "Search and select friends"}
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
                    <Option key={friend.id} value={JSON.stringify(friend)} >
                        {friend.name} ({friend.email})
                    </Option>

                    ))

                ) : null}

                </Select>
                <Button type="primary" shape="round">
                                                    Share
                                                    </Button>
            </div>
            <div className="w-full my-2 rounded-2xl h-[450px] md:h-[300px]">
                <Table
                    columns={friendColumns}
                    dataSource={friendsList.map((request) => ({
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
        </div>
    );
};

export default shareNotes;