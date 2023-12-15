import axiosInstance from "../utils/axiosInstance";
import { baseUrl } from "../utils/constants";
const CommentDeleteApi = async (id) => {
    try {
      console.log("Deleting comment with id:", id);
  
      const response = await axiosInstance.delete(`${baseUrl}posts/deletepost/${id}/`);
  
      console.log("Delete comment response:", response);
  
      if (response.status === 204) {
        console.log("Comment deleted successfully!");
      } else {
        console.error("Comment not deleted");
      }
    } catch (error) {
      console.error("Error deleting Comment:", error);
    }
  };
  
  export default CommentDeleteApi;
  