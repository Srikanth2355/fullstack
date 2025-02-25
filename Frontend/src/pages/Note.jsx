import React,{useEffect, useState} from 'react'
import { useParams } from 'react-router-dom'
import DOMPurify from 'dompurify';
import { Input, Button, Card, notification,Empty, Modal, Typography, Popconfirm } from "antd";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {  EditOutlined, ShareAltOutlined, DeleteOutlined } from "@ant-design/icons";
import axiosInstance from '../utils/axios';
import { useLoading } from '../utils/loader';

const Note = () => {  
    const {showLoading,hideLoading} = useLoading();
    const { id } = useParams();
    const [shownotes,setShownotes] = useState({});
    const { Title, Paragraph } = Typography;
    
    const [editnote,setEditnote] = useState(false);
    const [edittitle,setEdittitle] = useState("");
    const [editdescription,setEditdescription] = useState("");
    const [editplainDescription,setEditplainDescription] = useState("");
    
    const toolbarOptions = [
        [{ header: [1, 2, 3, false] }],
        [{ size: ["small", false, "large", "huge"] }],
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ indent: "-1" }, { indent: "+1" }],
        [{ color: [] }],
        [{ align: [] }],
        ["clean"],
    ];
    
    
    useEffect(() => {
        getnotesdata();
        
    },[]);

    const getnotesdata = async () => {
        showLoading();
        if(!id){
            notification.error({
                message: 'Error',
                description: 'Note id not found',
                duration: 5,
            })
            return;
        }
        axiosInstance.get(`/notes/getnote/${id}`)
        .then((response) => {
            if(response.status === 200){
                setShownotes(response.data.note);
            }
        })
        .catch((error) => {
            notification.error({
                message: 'Error',
                description: error.response.data.message,
                duration: 5,
            })
        })
        .finally(() => {
            hideLoading();
        })
    }
          
    return (
        <div> 
            {
                Object.keys(shownotes).length === 0 ? 
                    (   <div className='w-full h-[95vh] flex justify-center items-center'>
                            <Empty description="No notes found" className='text-2xl font-semibold mt-5' />
                        </div>):(
                        // Display note details
                        !editnote ? (
                            <div className=' h-full p-2 md:mx-3 md:p-3 my-4 rounded-2xl bg-white '>
                                <div className="flex justify-start items-center  pb-2">
                                    <Title level={4} className="mb-0 pt-2">{shownotes?.title}</Title>
                                </div>
                                <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(shownotes?.htmlcontent)}} className="!h-[70vh] md:!h-[60vh] mt-2 overflow-y-auto p-2 border rounded-md custom-scrollbar ql-editor">
                                </div>
                                {/* onClick={showEditNote} */}
                                <div className="flex justify-end space-x-3 mt-4 border-t pt-3">
                                    <Button type="primary" shape="round" icon={<EditOutlined />} >
                                    Edit Note
                                    </Button>
                                    {/* <Button type="primary" shape="round" icon={<ShareAltOutlined />} >
                                    Share Note
                                    </Button> */}
                                    
                                    {/* onConfirm={deleteNote} */}
                                    {/* Delete with Confirmation Popup */}
                                    <Popconfirm
                                    title="Are you sure you want to delete this note?"
                                    description="Note Once deleted cannot be recovered."
                                    onCancel={()=>{}}
                                    
                                    okText="Yes"
                                    cancelText="No"
                                    >
                                    <Button 
                                        icon={<DeleteOutlined />} 
                                        shape="round"
                                        className="!bg-red-600 text-white hover:!bg-red-600 hover:!border-none hover:!text-white"
                                    >
                                        Delete
                                    </Button>
                                    </Popconfirm>
                                </div>
                            </div>
                        ):(
                            <div className='w-full h-full'>
                                <div className="flex justify-between items-center border-b pb-2">
                                    <Title level={4} className="mb-0">Edit Note</Title>
                                </div>
                                <Input
                                    placeholder="Enter title...(max 150 characters)"
                                    maxLength={150}
                                    value={edittitle}
                                    onChange={(e) => setEdittitle(e.target.value)}
                                    className="mb-2"
                                />
        
                                <ReactQuill
                                    theme="snow"
                                    value={editdescription}
                                    onChange={handleDescriptionChange}
                                    placeholder="Write your note here..."
                                    className="hidden md:block"
                                    modules={{toolbar: toolbarOptions}}
                                    preserveWhitespace={true}
                                />
                                <ReactQuill
                                    theme="snow"
                                    value={editdescription}
                                    onChange={handleDescriptionChange}
                                    placeholder="Write your note here..."
                                    className="block customforsmallscreen !h-[60vh] md:hidden"
                                    modules={{toolbar: toolbarOptions}}
                                    preserveWhitespace={true}
                                />
        
                                <div className="flex justify-end space-x-3 mt-4 border-t pt-3">
                                    <Button type="primary" shape="round" onClick={updateNote}>
                                    Save Note
                                    </Button>
                                    <Button type="primary" shape="round" onClick={cancelEditNote}> 
                                    Cancel
                                    </Button>
                                </div>
                                
                            </div>
                        )
                        

                    )
                
            }
              
        </div>
    )
}

export default Note