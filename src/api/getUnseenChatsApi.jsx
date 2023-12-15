import axiosInstance from "../utils/axiosInstance";
import { baseUrl } from "../utils/constants";

const getUnseenChatsApi = async () => {
    try {
      
        const response = await axiosInstance.get(`${baseUrl}/chat/unseen/`, {
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
        console.log(response.data);
      } catch (error) {
        console.error(error);
    }
  };

export default getUnseenChatsApi