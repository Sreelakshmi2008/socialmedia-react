
import { baseUrl ,contacts} from "../utils/constants";
import axiosInstance,{checkAuthentication} from '../utils/axiosInstance';

const ContactListAPI = async () => {
    try {
      const response = await axiosInstance.get(baseUrl+contacts, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      console.log(response,'contacts')
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
  
  export default ContactListAPI;