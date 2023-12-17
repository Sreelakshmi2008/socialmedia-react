import AdminNav from "../components/AdminNav";
import AdminSide from "../components/AdminSide";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { baseUrl, userpostsdetails,deletepostadmin, base } from '../utils/constants';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, useParams, Link } from "react-router-dom";
import Swal from "sweetalert2";
import axiosInstanceAdmin from "../utils/axiosInstanceAdmin";
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CommentDeleteApi from "../api/CommentDeleteApi";

function AdminUserPostsDetails() {
    const navigate = useNavigate();
    const [post, setPost] = useState([]);
    const { id } = useParams();
   const [comments,setComments]=useState([])
    const [trigger,setTrigger]=useState(false)
    const [hoveredCommentId, setHoveredCommentId] = useState(null);


    useEffect(() => {
        axiosInstanceAdmin.get(`${baseUrl}${userpostsdetails}/${id}`)
            .then(response => {
                setPost(response.data);
                console.log(response.data);
            })
            .catch(error => {
                console.error('Error fetching post details:', error);
            });
            axiosInstanceAdmin.get(`${baseUrl}posts/comments/${id}/`)
            .then((response) => {
              setComments(response.data);
            })
            .catch((error) => {
              console.error(error);
            });
        }, [trigger]);

    // Function to format date using Intl.DateTimeFormat
    const formatCreatedAt = (createdAt) => {
        return new Intl.DateTimeFormat('en-IN', {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: false,
        }).format(new Date(createdAt));
    };


    const handleDeletePost = async (id) => {
        Swal.fire({
          title: "Are you sure?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes",
        }).then((result) => {
          if (result.isConfirmed) {
            const url = `${baseUrl}${deletepostadmin}/${id}/`;
            axiosInstanceAdmin
              .delete(url)
              .then((res) => {
                console.log("post deleted");
                navigate('/admin/admindash')
              })
              .catch((error) => {
                console.log(error);
              });
          }
        });
      };


    //   comment of post
    
    const [modalShow, setModalShow] = useState(false);
const handleModalOpen = ()=>{
  
    setOpen(true)
    

}
const handleClose = ()=>{
    setOpen(false)
}
const handleDeleteComment = async (id) => {
    Swal.fire({
        title: "Are you sure?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
      }).then((result) => {
        if (result.isConfirmed) {
          const url = `${baseUrl}myadmin/deletecomment/${id}/`;
          axiosInstanceAdmin
            .delete(url)
            .then((res) => {
              console.log("comment deleted");
             setTrigger(false)
            })
            .catch((error) => {
              console.log(error);
            });
        }
      });
  };
  
    return (
        <div>
            <AdminSide />
            <AdminNav />

            <div className="details_box" style={{
                marginLeft: '350px',
                marginTop: '100px',
                width: '70%',
                height: '500px',
                overflowX: 'auto',
            }}>
                
      

                <ul style={{
                    display: 'flex',
                    flexDirection: 'column',
                    marginTop: '40px',
                    fontSize: '20px',
                    fontWeight: '400',
                }}>
                    {post.length > 0 && (
                        <>
                            <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                                <span style={{ width: '210px', marginRight: '50px' }}>Caption</span>
                                <span style={{ marginRight: '10px' }}>: </span>
                                <span>{post[0].caption}</span>
                            </li>
                            <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                                <span style={{ width: '210px', marginRight: '10px' }}>Created at</span>
                                <span style={{ marginRight: '10px' }}>: </span>
                                <span style={{ whiteSpace: 'nowrap' }}>{formatCreatedAt(post[0].created_at)}</span>
                            </li>
                            {post[0].post_media && Array.isArray(post[0].post_media) && post[0].post_media.map((p, index) => (
                                <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }} key={index}>
                                    <img src={p.media_file} alt={`Media ${index}`} style={{ width: '10rem' }} />
                                </li>
                            ))}
                        </>
                    )}
                </ul>
                <button style={{
                backgroundColor:'#FF5252',
                border:'5px solid #FF5252',
                marginLeft:'35%',
                marginRight:'5%',
                marginTop:'20px',
                width:'100px',
                borderRadius:'5px'
                }}
                onClick={() => handleDeletePost(post[0].id)}>Delete</button>

                <button style={{
                backgroundColor:'#805ad5',
                border:'5px solid #805ad5',
                
                marginTop:'20px',
                width:'100px',
                borderRadius:'5px'
                }}
                onClick={() => setModalShow(true)}>Comments</button>


            <Modal show={modalShow} onHide={() => setModalShow(false)}aria-labelledby="contained-modal-title-vcenter">
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter" >
                    Comments
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="grid-example">
                    <Container>
                    <Row>
                       
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
                            src={base+comment.user.profile_pic}
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

                       
                              <button onClick={() => {setTrigger(true),handleDeleteComment(comment.id)}}
                                        style={{border:'5px solid red',marginLeft:'90px'}}>Delete Comment</button>
                         </div>
                        </div>
                        ))}
                       
                    </Row>

                    </Container>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => setModalShow(false)}>Close</Button>
                </Modal.Footer>
                </Modal>
            



      </div>

         
        </div>



    );
}

export default AdminUserPostsDetails;
