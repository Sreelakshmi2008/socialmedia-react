import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import createCommentApi from "../api/createCommentApi";
import {  baseUrl } from "../utils/constants";
import { RiDeleteBin6Line } from "react-icons/ri";
// import { AiOutlineSend } from "react-icons/ai";
import CommentDeleteApi from "../api/CommentDeleteApi";
import axiosInstance from "../utils/axiosInstance";
import Modal from 'react-modal'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose ,faTrash,faUser} from "@fortawesome/free-solid-svg-icons";



const CommentModal = ({ isOpen, onRequestClose, postId ,user}) => {
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);
  const [trigger, setTrigger] = useState(false);
  const [hoveredCommentId, setHoveredCommentId] = useState(null);
  const accessToken = localStorage.getItem("access_token");

  useEffect(() => {
    axiosInstance.get(`${baseUrl}posts/comments/${postId}/`)
      .then((response) => {
        setComments(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [trigger]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (postId) {
      try {
        await createCommentApi(postId, newComment);
        setTrigger(false);
        toast.success("Successfully Created", {
          position: "top-center",
        });
        setNewComment("");
      } catch (error) {
        toast.error("Failed to Create Post", {
          position: "top-center",
        });
      }
    }
  };

  const handleDeleteComment = async (id) => {
    if (id) {
      try {
        console.log("Deleting comment with id:", id);
  
        // Ensure that `id` is defined when making the DELETE request
        await CommentDeleteApi(id);
  
        toast.success("comment Deleted Successfully!", {
          position: "top-center",
        });
  
        setTrigger(false);
      } catch (error) {
        toast.error("Comment Not Deleted!", {
          position: "top-center",
        });
      }
    }
  };
  

  const modalRef = useRef();

  const handleOutsideClick = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onRequestClose();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <Modal
    isOpen={isOpen}
    onRequestClose={onRequestClose}
    contentLabel="Add Comment Modal"
    style={{
      overlay: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft:'25%',
        
     
      },
      content: {
        width: '50%', 
        border: '3px solid rgba(209, 90, 90, 0.5)',
        borderRadius:'15px',
        filter: 'drop-shadow(10px 10px 10px rgba(0, 0, 0, 0.5))',
      },
    }}
  >
   
    <div>
      <button
        onClick={onRequestClose}
      >
       <FontAwesomeIcon icon={faClose}/>
      </button>
    </div>

    <div style={{ paddingLeft:'5%'}}>
        {console.log(comments,'comments')}
      {comments.map((comment) => (
        
        <div
          key={comment.id}
          className="mb-4 flex items-center relative group p-2 bg-gray-100 rounded-lg"
          onMouseEnter={() => setHoveredCommentId(comment.id)}
          onMouseLeave={() => setHoveredCommentId(null)}
        >
            <div style={{display:'flex'}}>
                {comment.user.profile_pic?
          <img
            src={'http://localhost:8000'+comment.user.profile_pic}
            alt={comment.user.username}
            style={{width:'35px',height:'35px',borderRadius:'50%'}}
          />:<FontAwesomeIcon icon={faUser}             style={{width:'25px',height:'25px',borderRadius:'50%'}}
                    />}
            <div style={{ display: 'flex' }}>
            <p style={{ marginRight: '5px', fontWeight: 'semibold' }}>
                {comment.user.username}
            </p>
            <p style={{ fontWeight: 'bold',marginLeft:'-10px',marginTop:'15%' }}>{comment.content}</p>
            </div>

          </div>

          {hoveredCommentId === comment.id &&
            comment.user.id === user.id && (
<button onClick={() => {console.log('Button clicked',comment.id),handleDeleteComment(comment.id)}}>Delete Comment</button>

            )}
        </div>
      ))}
    </div>
    <div style={{marginTop:'80%',position:'fixed',width:'90%'}}>
    <form
      onSubmit={(e) => {
        handleSubmit(e);
        setTrigger(true);
      }}
      className="flex-grow flex items-end"
      style={{display:'flex'}}
    >
      <textarea
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="Write a comment..."
        rows="1"
        style={{width:'80%'}} />
      <button
        type="submit"
        className="py-2 px-4 ml-4"
      >comment</button>
    </form>
    </div>
  </Modal>



    )
  
};

export default CommentModal;