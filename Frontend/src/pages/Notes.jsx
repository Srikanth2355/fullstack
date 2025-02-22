import React, { Children, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Input, Button, Card, notification,Empty, Modal, Typography, Popconfirm } from "antd";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {useLoading} from '../utils/loader';
import axiosInstance from '../utils/axios';
import DOMPurify from 'dompurify';
import {  EditOutlined, ShareAltOutlined, DeleteOutlined } from "@ant-design/icons";
function Notes() {
    const user = useSelector((state) => state.user);
    const [isDisabled, setIsDisabled] = useState(true);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [plainDescription, setPlainDescription] = useState("");
    const [blockaddingnote,setBlockaddingnote] = useState(false);
    const {showLoading,hideLoading} = useLoading();
    const [allNotes, setAllNotes] = useState([]);
    const { Title, Paragraph } = Typography;
    const [editnote,setEditnote] = useState(false);
    const [edittitle,setEdittitle] = useState("");
    const [editdescription,setEditdescription] = useState("");
    const [editplainDescription,setEditplainDescription] = useState("");
    const [disableUpdateNote,setDisableUpdateNote] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [shownotes,setShownotes] = useState({});
    
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

    // Get all notes on page load
    useEffect(() => {
        getAllNotes();
    }, [])

    // Disable button if title or description is empty
    useEffect(() => {
        setIsDisabled(title.trim() === "" || description.trim() === "" || plainDescription.trim().length <= 1 ||(title.trim.length > 0 && title.trim().length < 100));
    },[title,description])

    // Disable button if edittitle or editdescription is empty
    useEffect(() => {
        setDisableUpdateNote(edittitle.trim() === "" || editdescription.trim() === "" || editplainDescription.trim().length <= 1 ||(edittitle.trim.length > 0 && edittitle.trim().length < 100));
    },[edittitle,editdescription])

    // Add notes to the database
    const AddNotes = () => {
        if(blockaddingnote){
            notification.error({
                message: 'Error',
                description: 'Maxium of 3000 characters are allowed.',
                duration: 2,                
            });
            return;
        }
        if(isDisabled){
            notification.error({
                message: 'Error',
                description: 'Title and Description are required fields.',
                duration: 2,
            });
            return;
        }
        showLoading();
        axiosInstance.post('/notes/addnote', {title: title, content: plainDescription, htmlcontent: description})
        .then((response) => {
            if(response.status === 200){
                notification.success({
                    message: 'Success',
                    description: response.data.message,
                    duration: 2,
                });
                setTitle("");
                setDescription("");
                setBlockaddingnote(false);
                getAllNotes();
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
    const getAllNotes = () => {
        showLoading();
        axiosInstance.get('/notes/getallnotes')
        .then((response) => {
            if(response.status === 200){
                setAllNotes(response.data.notes);
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
        })
    }

    const handleDescriptionChange = (value,delta,source,editor) => {
        const max_chars = 3000;
        const currentcharacters = editor.getLength();
        const text = editor.getText();
        if(editnote){
            setEditdescription((prev
                )=>value);
            setEditplainDescription((prev)=>text);

        }else{
            setPlainDescription((prev)=>text);
            setDescription((prev)=>value);
        }
        if(currentcharacters > max_chars){
            setBlockaddingnote(true)
        }else{
            setBlockaddingnote(false)
        }
        
    }

    const onClose = () => {
        cancelEditNote();
        setShowModal(false);
    }

    const showNoteDetails = (note) => {
        showLoading();
        setShownotes(note);
        setEdittitle(note.title);
        setEditdescription(note.content);
        setShowModal(true);
        hideLoading();
    }

    const cancelEditNote = () => {
        setEdittitle("");
        setEditdescription("");
        setEditplainDescription("");
        setEditnote(false);
    }

    const showEditNote = () => {
        setEdittitle(shownotes.title);
        setEditdescription(shownotes.htmlcontent);
        setEditnote(true);
    }

    const updateNote = () => {
        showLoading();
        if(blockaddingnote){
            notification.error({
                message: 'Error',
                description: 'Maxium of 3000 characters are allowed.',
                duration: 5,                
            });
            hideLoading();
            return;
        }
        if(disableUpdateNote){
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
                getAllNotes();
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            notification.error({
                message: 'Error',
                description: error.response.data.error,
                duration: 2,
            });
    }
        )
        .finally(() => {
            hideLoading();
        });
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
                onClose();
                getAllNotes();
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
        {/* Add Note Form */}
        <Card className=" my-5 p-3 shadow-md rounded-lg border border-gray-300 min-h-[500px] mx-2">
            <h2 className="text-xl font-semibold mb-4">Create a Note</h2>

            {/* Title Input */}
            <Input
                placeholder="Enter title...(max 150 characters)"
                maxLength={150}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mb-2"
            />

            {/* Description Editor (Fixed height, scrollable) */}
        
            <ReactQuill
                theme="snow"
                value={description}
                onChange={handleDescriptionChange}
                placeholder="Write your note here..."
                className=""
                modules={{toolbar: toolbarOptions}}
                preserveWhitespace={true}
            />

        

        {/* Add Note Button */}
        <Button
            type="primary"
            block
            disabled={isDisabled}
            className="mt-2"
            onClick={AddNotes}
        >
            Add Note
        </Button>
        </Card>
        {/* display notes */}
        {
            allNotes.length ==0 ?    
            (<Empty description="No notes found" className='text-2xl font-semibold mt-5' />):
            (<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 my-2'>
                {allNotes.map((note,index)=>{
                    return(
                        <Card key={index}  className=" p-3 shadow-md rounded-lg border border-gray-300 h-[300px] mx-2 cursor-pointer" onClick={()=>showNoteDetails(note)}>
                            <p className='text-xl font-semibold truncate px-2'>{note.title}</p>
                            <div className="h-[220px] overflow-hidden  px-2 cursor-pointer">
                                <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(note.htmlcontent) }} className='ql-editor' style={{overflow:"hidden",paddingLeft:"0px",paddingRight:"0px"}}></div>
                            </div>
                            {/* <ReactQuill
                                value={'note.content'} // Render the HTML content
                                readOnly={true} // Prevent editing
                                theme="snow" // Keep default styling
                                modules={{ toolbar: false }} // Remove the toolbar
                            /> */}
                        </Card>
                    )
                })}
            </div>
            )
        }

        <Modal
            open={showModal}
            onCancel={onClose}
            footer={null}
            maskClosable={false} // Prevent closing on outside click
            centered
            className="rounded-lg !w-[95vw] !h[80vh] md:!w-[80vw] md:!h-[60vh] bg-white"
        >
            {
                // Display note details
                !editnote && (
                    <div className='w-full h-full'>
                        <div className="flex justify-between items-center border-b pb-2">
                            <Title level={4} className="mb-0">Note Details</Title>
                            {/* <CloseOutlined className="text-lg cursor-pointer" onClick={onClose} /> */}
                        </div>

                        <Paragraph  className="text-lg font-semibold mt-4">{shownotes?.title}</Paragraph>

                        <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(shownotes?.htmlcontent)}} className="!h-[60vh] md:!h-[40vh] overflow-y-auto p-2 border rounded-md ql-editor">
                        </div>

                        <div className="flex justify-end space-x-3 mt-4 border-t pt-3">
                            <Button type="primary" shape="round" icon={<EditOutlined />} onClick={showEditNote}>
                            Edit Note
                            </Button>
                            <Button type="primary" shape="round" icon={<ShareAltOutlined />} >
                            Share Note
                            </Button>
                            
                            {/* Delete with Confirmation Popup */}
                            <Popconfirm
                            title="Are you sure you want to delete this note?"
                            description="Note Once deleted cannot be recovered."
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
                )
            }

            {
                // Edit note form
                editnote && (
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
            }

        </Modal>

    </>
  )
}

export default Notes