import AdminNav from "../components/AdminNav";
import AdminSide from "../components/AdminSide";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { baseUrl, userpostsdetails,deletepostadmin } from '../utils/constants';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, useParams, Link } from "react-router-dom";
import Swal from "sweetalert2";
import axiosInstanceAdmin from "../utils/axiosInstanceAdmin";

function AdminUserPostsDetails() {
    const navigate = useNavigate();
    const [post, setPost] = useState([]);
    const { id } = useParams();

    

    useEffect(() => {
        axiosInstanceAdmin.get(`${baseUrl}${userpostsdetails}/${id}`)
            .then(response => {
                setPost(response.data);
                console.log(response.data);
            })
            .catch(error => {
                console.error('Error fetching post details:', error);
            });
    }, []);

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
                                    <img src={baseUrl + p.media_file} alt={`Media ${index}`} style={{ width: '10rem' }} />
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
            </div>
        </div>
    );
}

export default AdminUserPostsDetails;
