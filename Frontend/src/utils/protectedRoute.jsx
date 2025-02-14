import React,{useState, useEffect} from "react";
import { useSelector, useDispatch } from "react-redux";
import axiosInstance from "./axios";
import { setUser, clearUser } from "../slice/user";
import { useLoading } from "./loader";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { notification } from "antd";

const ProtectedRoute = () => { 
    const dispatch = useDispatch();
    const {showLoading, hideLoading} = useLoading();
    const navigate = useNavigate();
    const location = useLocation();
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            showLoading();
            try {
                const response = await axiosInstance.get("/user/checklogin");
                if (response.status === 200) {
                    dispatch(setUser(response.data.userdata));
                    setIsAuthenticated(true);
                }
            } catch (error) {
                if(error.response.status === 401){
                    dispatch(clearUser());
                }
                notification.error({
                    message: "Error",
                    description: error.response?.data?.error || "Authentication failed",
                    duration: 5
                });
                setIsAuthenticated(false);
            } finally {
                hideLoading();
            }
        };

        checkAuth();
    }, [location.pathname]);
    if(isAuthenticated === null) return null;

    return isAuthenticated ? <Outlet /> : navigate("/login")

    
    
}

export default ProtectedRoute