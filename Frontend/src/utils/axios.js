import axios from 'axios'

const axiosInstance  = axios.create({
    baseURL: 'http://localhost:5000/api/',
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
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;


