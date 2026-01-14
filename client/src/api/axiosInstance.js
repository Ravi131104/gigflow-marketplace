import axios from "axios";

const newRequest = axios.create({
  baseURL: "https://gigflow-api-9mxy.onrender.com/api", // Your Render URL
  withCredentials: true,
});

// ADD THIS INTERCEPTOR
newRequest.interceptors.request.use((config) => {
  // 1. Check if user is logged in
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  
  // 2. If token exists, add it to the header
  if (currentUser?.token) {
    config.headers.Authorization = `Bearer ${currentUser.token}`;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default newRequest;