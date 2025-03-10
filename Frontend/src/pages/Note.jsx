import React,{useEffect, useState} from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import DOMPurify from 'dompurify';
import { Input, Button, notification,Empty, Typography, Popconfirm } from "antd";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {  EditOutlined, ShareAltOutlined, DeleteOutlined, BackwardOutlined } from "@ant-design/icons";
import axiosInstance from '../utils/axios';
import { useLoading } from '../utils/loader';

const Note = () => {  
    const navigate = useNavigate();
    const { Title, Paragraph } = Typography;
    const { id } = useParams();
    const [blockaddingnote,setBlockaddingnote] = useState(false);
    const {showLoading,hideLoading} = useLoading();
    const [shownotes,setShownotes] = useState({});
    
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
            navigate('/notes');
        })
        .finally(() => {
            hideLoading();
        })
    }

    const showEditNote = () => {
        setEdittitle(shownotes.title);
        setEditdescription(shownotes.htmlcontent);
        setEditplainDescription(shownotes.content);
        setEditnote(true);
    }

    const handleDescriptionChange = (value,delta,source,editor) => {
        const max_chars = 3000;
        const currentcharacters = editor.getLength();
        const text = editor.getText();
        setEditdescription((prev)=>value);
        setEditplainDescription((prev)=>text);
        if(currentcharacters > max_chars){
            setBlockaddingnote(true)
        }else{
            setBlockaddingnote(false)
        }
        
    }
    const updateNote = () => {
        showLoading();
        if(blockaddingnote){
            notification.error({
                message: 'Error',
                description: 'Maximum of 3000 characters are allowed.',
                duration: 5,                
            });
            hideLoading();
            return;
        }
        let disable = edittitle.trim() === "" || editdescription.trim() === "" || editplainDescription.trim().length <= 1 ||(edittitle.trim.length > 0 && edittitle.trim().length < 100);

        if(disable){
            notification.error({
                message: 'Error',
                description: 'Title and Description are required fields.',
                duration: 5,
            });
            hideLoading();
            return;
        }
        axiosInstance.post('/notes/updatenote', {id: shownotes._id, title: edittitle, content: editplainDescription, htmlcontent: editdescription})
        .then((response) => {
            if(response.status === 200){
                notification.success({
                    message: 'Success',
                    description: response.data.message,
                    duration: 2,
                });
                onClose();
                getnotesdata();
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            notification.error({
                message: 'Error',
                description: error.response.data.error,
                duration: 2,
            });
        })
        .finally(() => {
            hideLoading();
        });
    }

    const onClose = () => {
        cancelEditNote();
    }

    const cancelEditNote = () => {
        setEdittitle("");
        setEditdescription("");
        setEditplainDescription("");
        setEditnote(false);
    }

    const deleteNote = () => {
        showLoading();
        axiosInstance.post('/notes/deletenote', {id: shownotes._id})
        .then((response) => {
            if(response.status === 200){
                notification.success({
                    message: 'Success',
                    description: response.data.message,
                    duration: 5,
                });
                navigate('/notes');
            }
            
        })
        .catch((error) => {
            console.error('Error:', error);
            notification.error({
                message: 'Error',
                description: error.response.data.error,
                duration: 5,
            });
        })
        .finally(() => {
            hideLoading();
        });
    }
    return (
        <> 
            {
                Object.keys(shownotes).length === 0 ? 
                    (   <div className='w-full h-[95vh] flex justify-center items-center'>
                            <Empty description="No notes found" className='text-2xl font-semibold mt-5' />
                        </div>):(
                        // Display note details
                        !editnote ? (
                            <div className=' p-2 md:mx-3 md:p-3 my-2 rounded-2xl bg-white '>
                                <div className="flex justify-start items-center  pb-2">
                                    <Title level={4} className="mb-0 pt-2">{shownotes?.title}</Title>
                                </div>
                                <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(shownotes?.htmlcontent)}} className="h-[65vh] mt-2 overflow-y-auto p-2 border rounded-md custom-scrollbar ql-editor">
                                </div>
                                
                                <div className="flex justify-end space-x-3 mt-4 border-t pt-3">
                                    <Button color="primary" variant='outlined' shape="round" icon={<BackwardOutlined /> } onClick={() => navigate(-1)} >
                                    Back
                                    </Button>
                                    <Button type="primary" shape="round" icon={<EditOutlined />} onClick={showEditNote} >
                                    Edit Note
                                    </Button>
                                    {/* <Button type="primary" shape="round" icon={<ShareAltOutlined />} >
                                    Share Note
                                    </Button> */}
                                    
                                    
                                    {/* Delete with Confirmation Popup */}
                                    <Popconfirm
                                    title="Are you sure you want to delete this note?"
                                    description="Note shared with Friends will also be deleted."
                                    onCancel={()=>{}}
                                    onConfirm={deleteNote}
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
                            <div className=' p-2 md:mx-3 md:p-3 my-2 rounded-2xl bg-white'>
                                <div className="flex justify-between items-center  pb-2">
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
                                    className="!h-[65vh] md:!h-[65vh] custom-scrollbar customforsmallscreen"
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
              
        </>
    )
}

export default Note
