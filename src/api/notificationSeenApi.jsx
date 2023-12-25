import axios from 'axios';

import {  baseUrl } from '../utils/constants';
import axiosInstance from '../utils/axiosInstance';

const notificationSeenApi = async (notificationId) =>  {
  try {
    const accessToken = localStorage.getItem('access_token');

    // Make sure to include the 'Content-Type' header and remove extra object nesting
    const response = await axiosInstance.post(
      `${baseUrl}/posts/notifications-seen/${notificationId}/`,
      null, // No request body, you can use null
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json', // Include the Content-Type header
        },
      }
    );

    if (response.status === 200) {
      return response.data;
    } else {
      console.error('Error:', response.data);
    }
  } catch (error) {
    console.error('Error:', error);
    // Handle errors here
  }
};

export default notificationSeenApi;