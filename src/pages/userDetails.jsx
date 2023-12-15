import AdminNav from "../components/AdminNav"
import AdminSide from "../components/AdminSide"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { baseUrl, userdetail,deleteuser,blockuser} from '../utils/constants';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, useParams,Link   } from "react-router-dom";
import Swal from "sweetalert2";
import axiosInstanceAdmin,{ checkAuthentication } from "../utils/axiosInstanceAdmin";


function UserDetail(props){
    

    const navigate = useNavigate()
    const [users,setUsers] = useState([])
    const [userdeleted,setUserdeleted] = useState(false)
    const [userblocked,setUserblocked] = useState(false)

   

   console.log(userblocked,"user blocked or not")
    

    const {userEmail} = useParams()
    console.log(userEmail,"got user email")



    useEffect(() => {
      axiosInstanceAdmin.get(`${baseUrl}${userdetail}/${userEmail}`)
        .then(response => {
          setUsers(response.data);
          console.log(response.data);
        })
        .catch(error => {
          console.error('Error fetching user details:', error);

        });
    }, [userEmail]);
  
   console.log(users.is_active,"user blocked or notttttttttttttt")

    const handleDeleteUser = async (id) => {
        Swal.fire({
          title: "Are you sure?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes",
        }).then((result) => {
          if (result.isConfirmed) {
            const url = `${baseUrl}${deleteuser}/${id}/`;
            axiosInstanceAdmin
              .patch(url)
              .then((res) => {
                console.log("user deleted");
                setUserdeleted(true)
                navigate('/admin/admindash')
              })
              .catch((error) => {
                console.log(error);
              });
          }
        });
      };

  


    //   handle block button clicking event
    const handleBlockUser = async (id) => {
      Swal.fire({
        title: "Are you sure?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
      }).then((result) => {
        if (result.isConfirmed) {
          const url = `${baseUrl}${blockuser}/${id}/`;
          // Send data to indicate the change in is_active status
          const data = {
            is_active: !users.is_active,
          };
    
          axiosInstanceAdmin
            .patch(url, data)
            .then((res) => {
              console.log("success");
              setUserblocked(!userblocked);
    
              // Update the state based on the new value of is_active
              setUsers((prevUsers) => ({
                ...prevUsers,
                is_active: !prevUsers.is_active,
              }));
            })
            .catch((error) => {
              console.log(error);
            });
        }
      });
    };
    return(
        <div>
            <AdminSide/>
            <AdminNav/>
            <div className="details_box" style={{
                
                marginLeft:'350px',
                marginTop:'100px',
                width:'70%',
                height:'500px',
                overflowX: 'auto',
            }}>
             <div className='user_profile'>
                {users.profile_pic?<img src={baseUrl + users.profile_pic} alt="profile" style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                   marginRight:'20px'
                
                }} />:<img src="https://cdn-icons-png.flaticon.com/128/1144/1144760.png" alt="default profile" style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                   marginRight:'20px'
                
                }} />}
                <span style={{fontSize:'20px', fontWeight:'600',paddingTop:'100px'}}>{users.username}</span>
                <Link to={`/admin/admin_user_posts/${users.email}`} style={{fontSize:'18px', fontWeight:'600',paddingTop:'5px',marginLeft:'70%',border:'2px solid black',color:'blue'}} className="btn">User Posts</Link>

            </div>

            <ul style={{
                display:'flex',
                flexDirection:'column',
                marginTop:'40px',
                fontSize:'20px',
                fontWeight:'400',
               
                
            }}>
            <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
            <span style={{ width: '150px', marginRight: '10px' }}>Username</span>
            <span style={{ marginRight: '10px' }}>: </span>
            <span>{users.username}</span>
            </li>
            <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
            <span style={{ width: '150px', marginRight: '10px' }}>Name</span>
            <span style={{ marginRight: '10px' }}>: </span>
            <span>{users.name}</span>
            </li>
            <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
            <span style={{ width: '150px', marginRight: '10px' }}>Email</span>
            <span style={{ marginRight: '10px' }}>: </span>
            <span>{users.email}</span>
            </li>
            <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
            <span style={{ width: '150px', marginRight: '10px' }}>Phone Number</span>
            <span style={{ marginRight: '10px' }}>: </span>
            <span>{users.phone}</span>
            </li>
            <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
              <span style={{ width: '150px', marginRight: '10px' }}>is active</span>
              <span style={{ marginRight: '10px' }}>: </span>
              <input type='checkbox' checked={users.is_active} readOnly />
            </li>

            <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
            <span style={{ width: '150px', marginRight: '10px' }}>is staff</span>
            <span style={{ marginRight: '10px' }}>: </span>
            <input type='checkbox' checked={users.is_staff}/>
            </li>
            <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
            <span style={{ width: '150px', marginRight: '10px' }}>is superuser</span>
            <span style={{ marginRight: '10px' }}>: </span>
            <input type='checkbox' checked={users.is_superuser}/>
            </li>
            </ul>

            {!userdeleted&&<button style={{
                backgroundColor:'#FF5252',
                border:'5px solid #FF5252',
                marginLeft:'35%',
                marginRight:'5%',
                marginTop:'20px',
                width:'100px',
                borderRadius:'5px'
                }}
                onClick={() => handleDeleteUser(users.id)}>Delete</button>}
            <button style={{
                backgroundColor:'#808080',
                border:'5px solid #808080',
                width:'100px',
                borderRadius:'5px'
                }}
                onClick={() => handleBlockUser(users.id)}>{users.is_active ? "Block" : "Unblock"}</button>
            </div>
          

        </div>
    )
}


export default UserDetail