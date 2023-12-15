import axios from 'axios';
import { baseUrl } from '../utils/constants';
import axiosInstance from '../utils/axiosInstance';

const createCommentApi = async (postId, commentText) => {
  try {
    const formData = new FormData();
    formData.append('content', commentText);

    const response = await axiosInstance.post(`${baseUrl}posts/commentpost/${postId}/`, formData, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (response.status === 201) {
        
    } else {
      throw new Error('Failed to create comment');
    }
  } catch (error) {
    throw error;
  }
};

export default createCommentApi;