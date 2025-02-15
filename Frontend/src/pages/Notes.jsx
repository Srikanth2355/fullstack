import React, { Children, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Input, Button, Card, notification } from "antd";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
function Notes() {
    const user = useSelector((state) => state.user);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [view,setview] = useState("");
    const [blockaddingnote,setBlockaddingnote] = useState(false);
  
    // Check if both fields are filled
    let isDisabled = title.trim() === "" || description.trim() === "" || (title.trim.length > 0 && title.trim().length < 100);
    
    const toolbarOptions = [
        [{ header: [1, 2, 3, false] }],
        [{ size: ["small", false, "large", "huge"] }],
        ["bold", "italic", "underline"],
        [{ list: "ordered" }],
        [{ script: "sub" }, { script: "super" }],
        [{ indent: "-1" }, { indent: "+1" }],
        [{ direction: "rtl" }],
        [{ color: [] }, { background: [] }],
        [{ align: [] }],
        ["code-block"], 
        ["clean"],
    ];

    const AddNotes = () => {
        console.log("Title:", title);
        console.log("Description:", description);
        if(blockaddingnote){
            notification.error({
                message: 'Error',
                description: 'Maxium of 1000 characters are allowed.',
                duration: 2,                
            });
            return;
        }
        setview(description);
    }

    const handleDescriptionChange = (value,delta,source,editor) => {
        const max_chars = 1000;
        const currentcharactes = editor.getLength();
        setDescription((prev)=>value);
        if(currentcharactes > max_chars){
            setBlockaddingnote(true)
        }else{
            setBlockaddingnote(false)
        }
        
    }
  
  return (
    <>
        <Card className=" mt-5 p-3 shadow-md rounded-lg border border-gray-300 min-h-[500px] mx-2">
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
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
            <Card title="Default size card Default size card Default size card Default size card" className=" mt-5 p-3 shadow-md rounded-lg border border-gray-300 min-h-[250px] mx-2">
                <ReactQuill
                    value={view} // Render the HTML content
                    readOnly={true} // Prevent editing
                    theme="snow" // Keep default styling
                    modules={{ toolbar: false }} // Remove the toolbar
                />
            </Card>
            <Card title="Default size card" className=" mt-5 p-3 shadow-md rounded-lg border border-gray-300 min-h-[250px] mx-2">
                <ReactQuill
                    value={view} 
                    readOnly={true} // Prevent editing
                    theme="snow" // Keep default styling
                    modules={{ toolbar: false }} // Remove the toolbar
                />
            </Card>
            <Card title="Default size card Default size card Default size card Default size card" className=" mt-5 p-3 shadow-md rounded-lg border border-gray-300 min-h-[250px] mx-2">
                <ReactQuill
                    value={view} // Render the HTML content
                    readOnly={true} // Prevent editing
                    theme="snow" // Keep default styling
                    modules={{ toolbar: false }} // Remove the toolbar
                />
            </Card>
            <Card title="Default size card Default size card Default size card Default size card" className=" mt-5 p-3 shadow-md rounded-lg border border-gray-300 min-h-[250px] mx-2">
                <ReactQuill
                    value={''} // Render the HTML content
                    readOnly={true} // Prevent editing
                    theme="snow" // Keep default styling
                    modules={{ toolbar: false }} // Remove the toolbar
                />
            </Card>
            <Card title="Default size card Default size card Default size card Default size card" className=" mt-5 p-3 shadow-md rounded-lg border border-gray-300 min-h-[250px] mx-2">
                <ReactQuill
                    value={''} // Render the HTML content
                    readOnly={true} // Prevent editing
                    theme="snow" // Keep default styling
                    modules={{ toolbar: false }} // Remove the toolbar
                />
            </Card>
        </div>
    </>
  )
}

export default Notes