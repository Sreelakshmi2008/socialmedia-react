import axios from "axios";
import { baseUrl,refresh,checkauth } from "./constants";
// Create an Axios instance with interceptors


const axiosInstanceAdmin = axios.create();

axiosInstanceAdmin.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwtTokenAdmin');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
axiosInstanceAdmin.interceptors.response.use(
    (response) => {
      console.log('Response:', response);
      return response;
    },
    async (error) => {
      console.error('Error:', error);
  
      if (error.response && error.response.status === 401) {
        console.log('Handling 401...');
        try {
          const refreshToken = localStorage.getItem('refreshjwtTokenAdmin');
          console.log('Refreshing token:', refreshToken);
  
          const refreshResponse = await axiosInstanceAdmin.post(baseUrl + refresh, {
            refresh: refreshToken,
          });
  
          console.log('Refresh response:', refreshResponse.data);
  
          const newAccessToken = refreshResponse.data.access;
          const newRefreshToken = refreshResponse.data.refresh;
  
          console.log('New access token:', newAccessToken);
          console.log('New refresh token:', newRefreshToken);
  
          localStorage.setItem('jwtTokenAdmin', newAccessToken);
          localStorage.setItem('refreshjwtTokenAdmin', newRefreshToken);
  
          error.config.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosInstanceAdmin(error.config);
        }  catch (refreshError) {
            console.error('Error refreshing access token:', refreshError.response.status, refreshError.response.data);
            throw refreshError;
          }
          
      }
  
      return Promise.reject(error);
    }
  );



  export const  checkAuthentication = async () => {
    try {
      // Check if the user is authenticated by making a request
      const response = await axiosInstanceAdmin.get(baseUrl + checkauth);
      console.log(response.data,"authentication checking")
      return true;
    } catch (error) {
      console.error('Authentication error:', error);
      return false;
    }
  };
export default axiosInstanceAdmin;  