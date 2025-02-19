import React, { Children, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Input, Button, Card, notification,Empty } from "antd";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {useLoading} from '../utils/loader';
import axiosInstance from '../utils/axios';
import DOMPurify from 'dompurify';
function Notes() {
    const user = useSelector((state) => state.user);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [plainDescription, setPlainDescription] = useState("");
    const [blockaddingnote,setBlockaddingnote] = useState(false);
    const {showLoading,hideLoading} = useLoading();
    const [allNotes, setAllNotes] = useState([]);
  
    // Check if both fields are filled
    let isDisabled = title.trim() === "" || description.trim() === "" || (title.trim.length > 0 && title.trim().length < 100);
    
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
        getAllNotes();
    }, [])

    const AddNotes = () => {
        if(blockaddingnote){
            notification.error({
                message: 'Error',
                description: 'Maxium of 3000 characters are allowed.',
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
        setPlainDescription((prev)=>text);
        setDescription((prev)=>value);
        if(currentcharacters > max_chars){
            setBlockaddingnote(true)
        }else{
            setBlockaddingnote(false)
        }
        
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
                        <Card key={index}  className=" p-3 shadow-md rounded-lg border border-gray-300 h-[300px] mx-2">
                            <p className='text-xl font-semibold truncate px-2'>{note.title}</p>
                            <div className="h-[200px] overflow-hidden  px-2">
                                <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(note.htmlcontent) }} className='customUlStyles'></div>
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
    </>
  )
}

export default Notes