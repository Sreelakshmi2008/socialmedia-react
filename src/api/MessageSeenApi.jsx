import axiosInstance from "../utils/axiosInstance";
import { baseUrl } from "../utils/constants";

const MessageSeenAPI = async (userId) => {
    try {
     
      const response = await axiosInstance.get(`${baseUrl}chat/seen/${userId}/`, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        
        },
      });
      if  (response.status === 200) {
          return response.data;
      } else {
          console.log(response.error)
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  export default MessageSeenAPI;