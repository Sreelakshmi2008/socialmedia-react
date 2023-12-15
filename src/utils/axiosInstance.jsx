import axios from "axios";
import { baseUrl,refresh,checkauth } from "./constants";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// Create an Axios instance with interceptors


const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
axiosInstance.interceptors.response.use(
    (response) => {
      console.log('Response:', response);
      return response;
    },
    async (error) => {
      console.error('Error:', error);
      const originalConfig = error.config;
  
      if (error.response && error.response.status === 401 && !originalConfig._retry) {
        console.log('Handling 401...');
        originalConfig._retry = true

        try {
          const refreshToken = localStorage.getItem('refreshjwtToken');
          console.log('Refreshing token:', refreshToken);
  
          const refreshResponse = await axios.post(baseUrl + refresh, {
            refresh: refreshToken,
          });
  
          console.log('Refresh response:', refreshResponse.data);
  
          const newAccessToken = refreshResponse.data.access;
          const newRefreshToken = refreshResponse.data.refresh;
  
          console.log('New access token:', newAccessToken);
          console.log('New refresh token:', newRefreshToken);
  
          localStorage.setItem('jwtToken', newAccessToken);
          localStorage.setItem('refreshjwtToken', newRefreshToken);
          console.log('Original Request Config:', originalConfig);
          error.config.headers.Authorization = `Bearer ${newAccessToken}`;
          console.log('Updated Request Config:', error.config);
          return axiosInstance(originalConfig);
        }  catch (refreshError) {
            console.error('Error refreshing access token:', refreshError.response.status, refreshError.response.data);
            throw refreshError;
          }
          
      }
  
      return Promise.reject(error);
    }
  );



  
export default axiosInstance;  