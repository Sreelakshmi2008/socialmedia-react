import AdminNav from "../components/AdminNav"
import AdminSide from "../components/AdminSide"
import UserList from "./UserList";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { baseUrl, registeredUsers,refresh} from '../utils/constants';
import axiosInstanceAdmin,{checkAuthentication} from "../utils/axiosInstanceAdmin";
import { useNavigate,Link } from "react-router-dom";

function AdminPosts(){

    const [users,setUsers] = useState([])
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // New loading state
    const navigate = useNavigate()

    useEffect(() => {
        const fetchData = async () => {
          try {
            
            console.log('Making request...');
            const response = await axiosInstanceAdmin.get(baseUrl+registeredUsers)
          

            console.log('Response:', response.data);
      
            setUsers(response.data);
          } catch (error) {
            console.error('Error:', error);
      
          }
        };
      
        fetchData();
      }, []);
      const filteredusers = users.filter((user)=>!user.is_deleted)


   
    return(
        <div>
            <AdminSide/>
            <AdminNav/>
            {error ? (
                <div className="error-message">
                    Something went wrong while fetching user details.
                </div>
            ) : (
                <div>
                <div style={{color:'black',fontSize:'15px',marginLeft:'25%',marginTop:'5%'}}>
                
                <h2>Posts by Users</h2>
                </div>
          
                <ol style={{
                  display:'flex',
                  flexDirection:'column',
                  marginLeft:'30%',
                  marginTop:'2%',
                  overflow:'scroll'
                 
                }}>
                          {filteredusers.map((user, index) => (
                    <li className='mb-2' key={user.id}>
                      {user.is_deleted ? (
                        <span>{user.email}</span>
                      ) : (
                        <Link
                          to={`/admin/admin_user_posts/${user.email}`}
                          style={{
                            backgroundColor: 'transparent',
                            textDecoration: 'none',
                            color: 'blue',
                            transformOrigin: 'center',
                            display: 'inline-block',
                          }}
                          onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
                          onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                        >
                          {user.email}
                        </Link>
                      )}
                    </li>
                  ))}
          
          
          
                </ol>
              </div>
            )}

        </div>
    )
}


export default AdminPosts;