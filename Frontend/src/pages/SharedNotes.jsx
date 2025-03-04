import React, { useEffect, useState, useCallback } from 'react'
import {  Card, notification,Empty, Tooltip} from "antd";
import axiosInstance from '../utils/axios';
import DOMPurify from 'dompurify';
import { useLoading } from '../utils/loader'
import { useNavigate } from 'react-router-dom';

function SharedNotes() {  
    const navigate = useNavigate();
    const [allNotes, setAllNotes] = useState([]);
    const {showLoading,hideLoading} = useLoading();

    const getAllSharedNotes = useCallback(async () => {
        showLoading();
        await axiosInstance.get("/sharednotes/getallsharednotes")
        .then((response) => {
            if(response.status === 200){
                setAllNotes(response.data.notes);
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
    }, [])

    // Get all notes on page load
    useEffect(() => {
        console.log("i am executed")
        getAllSharedNotes();
    }, [])
    
    return (
        <>
        <div className='my-5 p-3 mx-2'>
            <div className='text-2xl font-semibold p-2 text-center'>
                Your Notes Shared with Your Friends
            </div>

            {
                allNotes?.sharedNotes?.length ==0 ?    
                (<Empty description="No notes found" className='text-2xl font-semibold mt-5' />):
                (<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 my-2'>
                    {allNotes?.sharedNotes?.map((note,index)=>{
                        return(
                            <Card key={index} 
                                className=" p-3  rounded-lg border border-gray-300 h-[300px] mx-2 cursor-pointer" >
                                <Tooltip title={note.title} trigger={window.innerWidth < 640 ? 'click' : 'hover'}>
                                    <p className='text-xl font-medium truncate px-2'>{note.title}</p>
                                </Tooltip>    
                                <div className="h-[240px] overflow-hidden  px-2 pb-2 cursor-pointer" onClick={()=>navigate(`/sharednotes/${note._id}`)}>
                                    <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(note.htmlcontent) }} className='ql-editor fade-mask2' 
                                        style={{
                                            overflow: "hidden",
                                            paddingLeft: "0px",
                                            paddingRight: "0px"
                                        }}
                                    ></div>
                                </div>
                            </Card>
                        )
                    })}
                </div>
                )
            }
        </div>

        </>
    )
}

export default SharedNotes
