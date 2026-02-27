import axios from 'axios';

const API = axios.create({
    // Change this from import.meta.env... to the hardcoded string
    baseURL: 'http://172.19.160.95:5000/api', 
});

// Leave your interceptors below if you have them...
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['x-auth-token'] = token;
    }
    return config;
});

export default API;