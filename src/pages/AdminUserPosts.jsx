import AdminNav from "../components/AdminNav"
import AdminSide from "../components/AdminSide"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { baseUrl, userposts} from '../utils/constants';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, useParams,Link   } from "react-router-dom";
import Swal from "sweetalert2";
import axiosInstanceAdmin from "../utils/axiosInstanceAdmin";

function AdminUserPosts(props){
    

    const navigate = useNavigate()
    const [posts,setPosts] = useState([])
    
    console.log(posts,"posts")
   

    const {userEmail} = useParams()
    console.log(userEmail,"got user email")



    useEffect(() => {
      axiosInstanceAdmin.get(`${baseUrl}${userposts}/${userEmail}`)
        .then(response => {
          setPosts(response.data);
          console.log(response.data);
        })
        .catch(error => {
          console.error('Error fetching post details:', error);

        });
    }, [userEmail]);
  
  
  const handlePostDetails = (id)=>{
    
    navigate(`/admin/admin_user_posts_details/${id}`)
  }
    


    
    return(
        <div>
            <AdminSide/>
            <AdminNav/>
            <div>
      <div style={{color:'black',fontSize:'15px',marginLeft:'25%',marginTop:'5%'}}>
     
      <h2>{posts.user} List</h2>
      </div>

      <ol style={{
        display:'flex',
        flexDirection:'column',
        marginLeft:'30%',
        marginTop:'2%',
        overflow:'scroll'
       
      }}>
                {posts.map((p, index) => (
          <li className='mb-2' key={p.id}>
           
              <span
                style={{
                  backgroundColor: 'transparent',
                  textDecoration: 'none',
                  color: 'blue',
                  transformOrigin: 'center',
                  display: 'inline-block',
                }}
                onMouseOver={(e) => (e.currentTarget.style.color = 'black',e.currentTarget.style.cursor = 'pointer')}
                onMouseOut={(e) => (e.currentTarget.style.color = 'blue')}
                onClick={()=>handlePostDetails(p.id)}
              >
                {p.caption}---{p.created_at}
              </span>
           
          </li>
        ))}



      </ol>
    </div>
          

        </div> 
    )
}


export default AdminUserPosts