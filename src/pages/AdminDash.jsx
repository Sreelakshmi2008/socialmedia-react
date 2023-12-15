import AdminNav from "../components/AdminNav"
import AdminSide from "../components/AdminSide"
import UserList from "./UserList";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { baseUrl, registeredUsers,refresh} from '../utils/constants';
import axiosInstanceAdmin,{checkAuthentication} from "../utils/axiosInstanceAdmin";
import { useNavigate } from "react-router-dom";

function AdminDash(){

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
      
   
   
    return(
        <div>
            <AdminSide/>
            <AdminNav/>
            {error ? (
                <div className="error-message">
                    Something went wrong while fetching user details.
                </div>
            ) : (
                <UserList users={users} />
            )}

        </div>
    )
}


export default AdminDash