import React, { useEffect, useState, useRef } from "react";
import ContactListAPI from "../api/ContactListApi";
import CreateChatRoomAPI from "../api/CreateChatRoomApi";
import GetChatMessages from "../api/GetMessageApi";
import MessageSeenAPI from "../api/MessageSeenApi";
import { base, baseUrl,user } from "../utils/constants";
import { Navigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import './Chatting.css'
import NavBar from "./NavBar";
import { AiOutlineSend } from "react-icons/ai";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser} from '@fortawesome/free-solid-svg-icons';

const Chat = () => {
  const [profiles, setProfiles] = useState([]);
  const [ws, setWs] = useState(null);
  const [messages, setMessages] = useState([]);
  const [trigger, setTrigger] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [selectedProfile, setSelectedProfile] = useState(null);
  
  const chatMessagesContainerRef = useRef(null);
  const [hasJoinedChatroom, setHasJoinedChatroom] = useState(false);
  const t = localStorage.getItem('jwtToken')
  const [users,setusers ]= useState(null)


  console.log(profiles, "my profiles");

  useEffect(() => {
    console.log("first useefect")
    const fetchData = async () => {
      try {

        const r = await axiosInstance.get(baseUrl+user)
        const result = await ContactListAPI();
        setusers(r.data)
        setProfiles(result);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  
  useEffect(() => {
    console.log("mesage listener usefeect")
    let messageListener;
    if (ws) {
      messageListener = (event) => {
        const message = JSON.parse(event.data);
        // setMessages((prevMessages) => [...prevMessages, message]);
        // setTrigger(true);
        // Scroll to the last message
        chatMessagesContainerRef.current.scrollTop =
          chatMessagesContainerRef.current.scrollHeight;
      };
      ws.addEventListener("message", messageListener);
    }
    return () => {
      if (ws) {
        ws.removeEventListener("message", messageListener);
        ws.close()
      }
    };
  }, [ws]);



  const handleSendMessage = () => {
    if (ws && ws.readyState === WebSocket.OPEN && inputMessage.trim() !== "") {
      console.log(inputMessage,"input messagee")
      ws.send(JSON.stringify({ message: inputMessage }));
      console.log("message send")
      setInputMessage("");
      setTrigger(false);

    }
  };
  
  const joinChatroom = async (userId) => {
    try {
      const data = await CreateChatRoomAPI(userId);
      const accessToken = localStorage.getItem("jwtToken");
      const websocketProtocol =
        window.location.protocol === "https:" ? "wss://" : "ws://";
        
      const wsUrl = `${websocketProtocol}//back.my-media.online/ws/chat/${data.id}/?token=${accessToken}`;
      // const wsUrl = `${websocketProtocol}theghostkart.shop:8001/ws/chat/${data.id}/?token=${accessToken}`;
      

      const newChatWs = new WebSocket(wsUrl);
      setTrigger(false);

      newChatWs.onopen = async () => {
        console.log("Chatroom WebSocket connection opened");
        const previousMessages = await GetChatMessages(data.id);
        setMessages(previousMessages);
        await MessageSeenAPI(userId);
        setProfiles((prevProfiles) => {
          return prevProfiles.map((profile) => {
            if (profile.id === data.id) {
              return { ...profile, unseen_message_count: 0 };
            }
            return profile;
          });
        });
        // Scroll to the last message
        chatMessagesContainerRef.current.scrollTop =
          chatMessagesContainerRef.current.scrollHeight;
      };

      newChatWs.onclose = () => {
        console.log("Chatroom WebSocket connection closed");
      };

      newChatWs.onmessage = (event) => {
        const message = JSON.parse(event.data);
        setMessages((prevMessages) => [...prevMessages, message]);

        console.log(message);
      };

      setWs(newChatWs);
       setHasJoinedChatroom(true); 
    } catch (error) {
      console.error(error);
      
    }
    setSelectedProfile(userId);
  };


  // Function to scroll to the bottom
  const scrollToBottom = () => {
    console.log("scrolling")
    chatMessagesContainerRef.current.scrollTop = chatMessagesContainerRef.current.scrollHeight;
  };


  return (
    
      <>
      <NavBar/>
      
      <div className="col-6 side_chat">
      
        <div style={{display:'flex',flexDirection:'column'}}>
        {profiles
              ? profiles.map((profile) => (
                  <div
                    key={profile.id}
                    onClick={() => {
                      joinChatroom(profile.id);
                      setTrigger(true);
                    }}
                    className='p-3 cursor-pointer'
                     style={{backgroundColor:selectedProfile === profile.id ? "lightblue" : "white"}}
                   
                  >

                    
                      <div style={{display:'flex',marginLeft:'5%'}}>
                      <div style={{border:'2px solid black',borderRadius:'50%'}}>      
                      {profile.profile_pic?     
                      
                          <img
                        src={base + profile.profile_pic }
                        alt="Profile"
                        style={{width:'35px',height:'35px',borderRadius:'50%'}}
                        className="rounded-full object-cover"
                      />:  <FontAwesomeIcon icon={faUser}  className="rounded-full object-cover"  
                      style={{width:'30px',height:'30px',borderRadius:'50%',padding:'5px'}}/>
                     } </div>
                    
                      <h5 style={{marginLeft:'10%'}}>
                        {profile.username}
                      </h5>
                   
                    {console.log(profile.unread_message_count,"unseen count")}
                    {profile.unread_message_count > 0 && (
                        <div style={{marginLeft:'20%',border:'2px solid blue',width:'8%',borderRadius:'50%',height:'8%',paddingLeft:'2%'}}>
                          {profile.unread_message_count}
                        </div>
                      )}
                       </div>
                  </div>
                ))
              : null}
      </div>
      </div>
      <div className="col-6 main_chat">
     
      {!hasJoinedChatroom && (
  <div className="centered-image">
    <img
      src="https://static.vecteezy.com/system/resources/previews/023/122/546/original/mobile-chat-app-tiny-people-using-laptop-for-chatting-online-communication-social-networking-messages-speech-bubbles-modern-flat-cartoon-style-illustration-on-white-background-vector.jpg"
      alt="Profile"
      style={{width:'40%',marginTop:'20%',marginLeft:'30%'}}
    />
  </div>
) }
        
          {/* Chat Messages Container */}
          <div
            className="p-4 rounded-lg shadow-xl messages-box"
            ref={chatMessagesContainerRef}
          >
            {messages.map((message, index) => (
              <div
                key={index}
                className='flex mt-4 '
                style={{marginLeft:
                  message.sender_email === users.email
                    ? '80%'
                    : "0px"
                }}
              >
                <div className="flex items-center space-x-3">
                  {message.sender_email !== users.email && (
                    <div className="h-10 w-10 rounded-full bg-gray-300">
                      {console.log(message.profile_pic,"single message")}
                      {console.log(message,"single message")}

                      <img
                        src={base + (message.sender_profile_pic || message.profile_pic)}
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover"
                        style={{width:'35px',height:'35px',borderRadius:'50%'}}

                      />
                    </div>
                  )}
                
                  <div className="max-w-xs p-3">
                    <p className="text-sm">{message.message || message.content}</p>
                    {/* <span className="text-xs text-gray-500 leading-none">
                      {message.created} ago
                    </span> */}
                  </div>
                </div>
              </div>
            ))}
         
          </div>
          {/* Input Field for Sending Messages */}
         
          {hasJoinedChatroom && (
            <div className="pt-4 message-send">
               {/* <button onClick={console.log("scroll")}>Scroll to Bottom</button> */}
              <div className="relative flex items-center w-full">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  className="flex-auto p-2"
                  placeholder="Type your message..."
                />
                <button
                  className="send-btn btn"
                  type="button"
                  onClick={handleSendMessage}
                >
                  <AiOutlineSend />
                </button>
              </div>
            </div>
          )}
        </div>
        
      
  
    </>
  )
}





export default Chat;