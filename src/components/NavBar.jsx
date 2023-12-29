import React,{ useState,useEffect } from 'react';
import './NavBar.css';
import { Link} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUser } from '@fortawesome/free-solid-svg-icons';
import { base, baseUrl } from '../utils/constants';

import NotificationModal from "./NotificationModal";
import getNotificationsApi from "../api/getNotificationsApi";
import getUnseenChatsApi from "../api/getUnseenChatsApi";
import {
  AiTwotoneHome,
  AiFillWechat,
  AiTwotoneNotification,
} from "react-icons/ai";
import axiosInstance from '../utils/axiosInstance';
import UserSearchDropdown from '../pages/SearchDropdown';


function NavBar({ username,pic}) {

  const [showNotify, setShowNotify] = useState(false);
  const [notification, setNotification] = useState([]);
  const [unseenChats, setUnseenChats] = useState([]);
   const token = localStorage.getItem('jwtToken')

  useEffect(() => {
    
    const fetchData = async () => {
      try {
        const data = await getNotificationsApi();
        setNotification(data);

        const unseenChatsResponse = await getUnseenChatsApi(); // Implement this API function
        setUnseenChats(unseenChatsResponse);
        console.log(unseenChats, "iam chatttttttttt");
      } catch (error) {
        console.error(error);
      }
    };
    if (token) {
      fetchData();
    }
  }, [token]);


    useEffect(() => {
      if (token) {
        console.log("notification websocket calling")
        const websocketProtocol =
          window.location.protocol === "https:" ? "wss://" : "ws://";
        // const socket = new WebSocket(`${websocketProtocol}//127.0.0.1:8000/ws/notification/?token=${token}`);
        const socket = new WebSocket(
          `${websocketProtocol}back.my-media.online/ws/notification/?token=${token}`
        );
        console.log(socket,"notification socket")

        socket.onopen = () => {
          console.log("WebSocket connection established");
        };

        socket.onmessage = (event) => {
          const newNotification = JSON.parse(event.data);
          console.log(newNotification,"new notification");
          if (newNotification.type === "notification") {
            setNotification((prevNotifications) => [
              ...prevNotifications,
              newNotification.payload,
            ]);
          }
        };
        socket.onerror = (error) => {
  console.error("WebSocket error:", error);
};
        socket.onclose = (event) => {
          console.log("WebSocket connection closed", event);
        };

        return () => {
          socket.close();
        };
      }
    }, [token]);

    

    const removeNotification = (notificationIdToRemove) => {
      setNotification((prevNotifications) =>
        prevNotifications.filter(
          (notification) => notification.id !== notificationIdToRemove
        )
      );
    };


    // search for users.....
    const [showDropdown, setShowDropdown] = useState(false);
    const [search_user_query,setSearchUserQuery]=useState('')
    const [searchUsers,setSearchUsers]=useState([])
   const handleSearch = async()=>{
      const response = await axiosInstance.get(`${baseUrl}api/search/?query=${search_user_query}`)
      setSearchUsers(response.data)
      setShowDropdown(true);
      console.log(searchUsers)
      
   }
   const handleUserClick = (user) => {
    
    console.log('User clicked:', user);

    // Reset search query and hide dropdown after user click
    setSearchUserQuery('');
    setShowDropdown(false);
  };
  useEffect(() => {

    return () => {
      setShowDropdown(false);
    };
  }, [search_user_query]); 


  return (
    
    <div className='navbar navbar-expand-lg navbar-light'>
      <Link to="/homepage" className='navbar-brand'><strong>CHIT-CHAT</strong></Link>
      <div className='collapse navbar-collapse d-flex justify-content-end align-items-center'>
        <div className='navbar-nav'>
            <div className="input-group rounded">
              <input type="search" className="form-control rounded" placeholder="Search for friends..." aria-label="Search" aria-describedby="search-addon" 
              value={search_user_query} onChange={(e)=>setSearchUserQuery(e.target.value)}/>
              
              <span className="input-group-text border-0" id="search-addon" onClick={handleSearch}>
                <FontAwesomeIcon icon={faSearch} className="text-black" />
              </span>
            </div>
            {showDropdown && searchUsers.length > 0 && (
              <div className='searchDrop'>
            <UserSearchDropdown users={searchUsers} handleUserClick={handleUserClick} isadmin={false}/>
            </div>
          )}  
        </div>
        
        <div className='nav_profile'>
          {pic ? (
            <img src={pic} alt="Profile" className='rounded-circle'  />
          ) : (
            <FontAwesomeIcon icon={faUser} className="text-black nav_image" />
          )}
          <span className=''>Hi........{username}</span>
        </div>
      </div>
      <div className="flex items-center gap-4 py-3" style={{marginRight:'40px'}}>
            <button
              className="text-sm leading-5 font-normal relative"
              style={{color:' black',border:'2px solid  rgba(209, 90, 90, 0.5)',backgroundColor:' rgba(209, 90, 90, 0.5)'}}
              onMouseOver={(e)=>e.currentTarget.style.cursor='pointer'}
              onClick={() => {setShowNotify(true)}}
            >
              <AiTwotoneNotification className="text-2xl" />{" "}
             {/* Increase icon size */}
             {notification?.length > 0 && (
                <span className="absolute -top-4 -right-2 text-black px-2 py-1 rounded-full">
                  {notification?.length}
                </span>
              )}
            </button>
             
      </div>
      {showNotify && (
        <div className="notification-modal">
          <NotificationModal
            isVisible={showNotify}
            onClose={() => setShowNotify(false)}
            notification={notification}
            removeNotification={removeNotification}
          />
        </div>
      )}
      
    </div>
     
  );
}

export default NavBar;
