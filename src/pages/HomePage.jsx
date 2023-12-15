import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { baseUrl,user,refresh,mypost,checkauth ,recommended} from '../utils/constants';
import { Link, useNavigate } from "react-router-dom";
import NavBar from '../components/NavBar';
import SideBar from '../components/Sidebar';
import Posts from '../components/Posts';
import axiosInstance,{checkAuthenticationForUsers} from '../utils/axiosInstance';
import { Loader,Placeholder} from 'rsuite';
import './loader.css'


function Home({googleuser}) {
  const [userName, setUserName] = useState(null);
  const [userposts, setUserposts] = useState([]);
  const [recommendedposts, setRecomposts] = useState([]);

  const navigate=useNavigate()
  useEffect(() => {
  
    
    const fetchData = async () => {
      try {
      
       
        const response = await axiosInstance.get(baseUrl + user);
        const postresponse = await axiosInstance.get(baseUrl + mypost);
        const recommendedResponse = await axiosInstance.get(baseUrl + recommended);

        console.log('Response:', response.data);
        console.log('PostResponse:', postresponse.data);
        console.log('Recommended Posts:', recommendedResponse.data);

  
        setUserName(response.data);
        setUserposts(postresponse.data);
        setRecomposts(recommendedResponse.data);


      } catch (error) {
        console.error('Error:', error);
      }      
    };
  
    fetchData();
  }, []);

  return (
    <>
  {userName && userposts ? (
      <>
        <NavBar username={userName.username} pic={userName.profile_pic} />
        <SideBar pic={userName.profile_pic} post={userposts} />
        <Posts username={userName} posts={recommendedposts} pic={userName.profile_pic}  isMypost={false}/>
        
      </>
    ) : (
      // Loading state or alternative content
      <div>
      <Loader center content="loading" size='lg' />
    </div> 
    )}
    </>
  );
}

export default Home;
