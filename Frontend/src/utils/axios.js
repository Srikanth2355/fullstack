import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const axiosInstance  = axios.create({
    baseURL: '/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
    }
});

axiosInstance.interceptors.response.use(
    response => response,
    error => {
        if (error.response.status === 401) {
            useNavigate('/login');
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;


