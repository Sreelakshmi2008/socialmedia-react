import axios from "axios";
import { baseUrl } from "../utils/constants";
import axiosInstance from "../utils/axiosInstance";


const getNotificationsApi = async () => {
    try {
      
        const response = await axiosInstance.get(`${baseUrl}posts/notifications/`, {
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

export default getNotificationsApi



