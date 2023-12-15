import React, { useState,useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser ,faHeart,faBookmark,faShare, faTrash} from '@fortawesome/free-solid-svg-icons';
import { Link ,useParams} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { baseUrl ,like,deletepost,mypost,user} from '../utils/constants';
import axios from 'axios';
import axiosInstance from '../utils/axiosInstance';
import NavBar from '../components/NavBar';
import SideBar from '../components/Sidebar';
import Posts from '../components/Posts';

function MyPosts() {
  const [postlike,setLike] =useState()
  const [posts,setPosts] = useState([])
  const [userName, setUserName] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
       
        const postresponse = await axiosInstance.get(baseUrl + mypost);
        const response = await axiosInstance.get(baseUrl + user);

        console.log('PostResponse:', postresponse.data);
        console.log('Response:', response.data);

  
        setPosts(postresponse.data);
        setUserName(response.data);


      } catch (error) {
        console.error('Error:', error);
      }      
    };
  
    fetchData();
  }, []);

  const sortedPosts = [...posts].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  console.log(sortedPosts,"posts")

  return (
<>
<NavBar username={userName?userName.username:""} pic={userName?userName.profile_pic:""} />
        <SideBar pic={userName?userName.profile_pic:""}/>
  
 <Posts username={userName?userName:""} posts={sortedPosts} pic={userName?userName.profile_pic:""} isMypost={true}/>
    </>
  );
}

export default MyPosts;
