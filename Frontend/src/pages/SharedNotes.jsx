import React, { useEffect, useState, useCallback } from 'react'
import {  Card, notification,Empty, Tooltip,Modal } from "antd";
import axiosInstance from '../utils/axios';
import DOMPurify from 'dompurify';
import { useLoading } from '../utils/loader'
import { useNavigate } from 'react-router-dom';
import { ShareAltOutlined } from '@ant-design/icons';
import ShareNotes from "../components/sharenotes.jsx";


function SharedNotes() {  
    const navigate = useNavigate();
    const [allNotes, setAllNotes] = useState([]);
    const {showLoading,hideLoading} = useLoading();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [keytoforcererender, setKeytoforcererender] = useState(false);
    const [shareNoteid, setShareNoteid] = useState("");
    
    

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
                (<div className='h-[80vh] flex justify-center items-center'>
                    <Empty description="No notes found" className='text-2xl font-semibold mt-5' />
                </div>):
                (<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 my-2'>
                    {allNotes?.sharedNotes?.map((note,index)=>{
                        return(
                            <Card key={index} 
                                className=" p-3  rounded-lg border border-gray-300 h-[300px] mx-2 cursor-pointer" 
                                actions={[
                                    <ShareAltOutlined key="share" style={{fontSize:"19px"}} onClick={() =>{setIsModalOpen(true);setShareNoteid(note._id);setKeytoforcererender((prev)=>!prev)} } />
                                  ]}
                                >
                                <Tooltip title={note.title} trigger={window.innerWidth < 640 ? 'click' : 'hover'}>
                                    <p className='text-xl font-medium truncate px-2'>{note.title}</p>
                                </Tooltip>    
                                <div className="h-[210px] overflow-hidden  px-2 pb-2 cursor-pointer" onClick={()=>navigate(`/notes/${note._id}`)}>
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

        <Modal
            title="Share Notes"
            open={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            footer={null}
            maskClosable={false}
            centered
            className='custom-modal rounded-xl'
            width={{
                xs: '90vw',
                sm: '80vw',
                md: '60vw',
              }}
        >
            <div className='w-90vw sm:w-[80vw] md:w-[50vw] min-h-96 h-[550px] md:h-[400px]' >
                <ShareNotes id={shareNoteid} key={keytoforcererender} getAllSharedNotes={getAllSharedNotes} closeModal={() => setIsModalOpen(false)} />
            </div>
        </Modal>

        </>
    )
}

export default SharedNotes
