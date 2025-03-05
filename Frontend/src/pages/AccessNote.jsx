import React,{useEffect, useState} from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axios";
import { useLoading } from "../utils/loader";
import DOMPurify from 'dompurify';
import { notification, Typography, Empty, Button } from "antd";
import { BackwardOutlined } from "@ant-design/icons";
const AccessNote = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const {showLoading, hideLoading} = useLoading();
    const [shownotes, setShownotes] = useState([]);
    const { Title } = Typography;

    const getAccessNote = async () => {
        showLoading();
        if(!id){
            notification.error({
                message: 'Error',
                description: 'Note id not found',
                duration: 5,
            })
            return;
        }
        axiosInstance.get(`/sharednotes/getaccessnote/${id}`)
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
            navigate('/sharedwithme');
        })
        .finally(() => {
            hideLoading();
        })
    }

    useEffect(() => {
        getAccessNote();
    }, []);

    return (
        <>
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
                </div>
            </div>
        </>
    );
};

export default AccessNote;