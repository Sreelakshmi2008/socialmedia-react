import axiosInstance,{checkAuthentication} from '../utils/axiosInstance';
import { baseUrl } from '../utils/constants';

const CreateChatRoomAPI = async (userId) => {
    try {
      let body = {}
      const response = await axiosInstance.post(`${baseUrl}chat/create-room/${userId}/`,body,{
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      if (response.status === 200 || response.status===201) {
        return response.data
      } else {
        console.log(response.error);
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  export default CreateChatRoomAPI;
  