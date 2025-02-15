import React, { Children, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Input, Button, Card } from "antd";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
function Notes() {
    const user = useSelector((state) => state.user);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [view,setview] = useState("");
  
    // Check if both fields are filled
    const isDisabled = title.trim() === "" || description.trim() === "";
    
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
        setview(description);

    }
  
  return (
    <>
    <Card className=" mt-5 p-3 shadow-md rounded-lg border border-gray-300 min-h-[500px] mx-2">
      <h2 className="text-xl font-semibold mb-4">Create a Note</h2>

      {/* Title Input */}
      <Input
        placeholder="Enter title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="mb-2"
      />

      {/* Description Editor (Fixed height, scrollable) */}
      
        <ReactQuill
          theme="snow"
          value={description}
          onChange={setDescription}
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

    {/* <div className='mx-2'>
    <p dangerouslySetInnerHTML={{ __html: view }} />
        </div> */}
    </>
  )
}

export default Notes