
import { Navigate } from "react-router-dom";
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { like, baseUrl ,user} from "../utils/constants";
import axiosInstance from "../utils/axiosInstance";
import NavBar from "./NavBar";
import SideBar from "./Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser,faHeart,faComment,faBookmark,faClose } from "@fortawesome/free-solid-svg-icons";
import { Loader } from "rsuite";
import '../pages/loader.css';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import CommentModal from "./CommentModal";
import Carousel from 'react-bootstrap/Carousel';
import FollowUnfollowApi from "../api/FollowUnFollowApi";

    const ProfileOfOthers = () => { 
        const { id } = useParams()
        const [searcheduser, setSearchedUser] = useState(null); 
        const [userName, setUserName] = useState(null);
      
            
        const sliderSettings = {
            dots: true,
            infinite: true,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1,
        };


        useEffect(() => {


            const fetchData = async()=>{
                const response = await axiosInstance.get(baseUrl + user);
                setUserName(response.data);
            // Fetch user data using the GetUserView API and the passed userId prop
            await axiosInstance.get(`${baseUrl}api/getusers/${id}/`)
            .then((response) => {
                setSearchedUser(response.data);
                console.log(searcheduser,"user clicked details")
            })
            .catch((error) => {
                console.error(error);
            });
            }
            fetchData()
        }, [id])



        const handleLike = async (id) => {
            try {
              const likeresponse = await axiosInstance.post(baseUrl + like, { id: id });
              console.log(likeresponse);
        
              const updatedPosts = searcheduser.posts.map((post) => {
                if (post.id === id) {
                  return {
                    ...post,
                    is_liked_or_not: likeresponse.data.message === 'You have liked this post',
                    like_count: likeresponse.data.like_count,
                  };
                }
                return post;
              });
              setSearchedUser((prevState) => ({
                ...prevState,
                posts: updatedPosts,
              }))
            } catch (error) {
              console.error('Error handling like:', error);
            }
          };
        

          
  const handleSavedPost = async (id) => {
    try {
      const savedresponse = await axiosInstance.post(`${baseUrl}posts/savepost`, { id: id });
      console.log(savedresponse);
  
      if (savedresponse.status === 201) {
        const updatedUserPosts = searcheduser.posts.map((post) => {
          if (post.id === id) {
            return {
              ...post,
              saved_or_not: true,
            };
          }
          return post;
        });
  
        setSearchedUser((prevState) => ({
            ...prevState,
            posts: updatedUserPosts,
          }))
        
      } else {
        const updatedUserPosts = searcheduser.posts.map((post) => {
          if (post.id === id) {
            return {
              ...post,
              saved_or_not: false,
            };
            
          }
         
          return post;
        });
  
        setSearchedUser((prevState) => ({
            ...prevState,
            posts: updatedUserPosts,
          }))
        
        
      }
    } catch (error) {
      console.error('Error handling save/unsave:', error);
    }
  };
  

  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);

    
    const openCommentModal = (postId) => {
    setSelectedPostId(postId);
    setIsCommentModalOpen(true);
    };

    // Function to close the CommentModal
    const closeCommentModal = () => {
    setIsCommentModalOpen(false);
    };


    const [open, setOpen] = useState(false);
    const [mediafiles, setMediafiles] = useState(0);

    // ...

    const openMediaSliderModal = (mediaFiles) => {
        setOpen(true);
        setMediafiles(mediaFiles)
    };
 


    const handleFollowUnfollow = async (userId) => {
        try {
          const followresponse = await FollowUnfollowApi(userId);
      
          if (followresponse.detail === "You are now following this user.") {
            // If the user followed, update is_following to true
            setSearchedUser((prevState) => ({
              ...prevState,
              user_data: {
                ...prevState.user_data,
                is_following: true,
              },
            }));
          } else {
            // If the user unfollowed, update is_following to false
            setSearchedUser((prevState) => ({
              ...prevState,
              user_data: {
                ...prevState.user_data,
                is_following: false,
              },
            }));
          }
        } catch (e) {
          console.log(e);
          console.log("follow/unfollow got an error");
        }
      };

    return (
        <>
{!open&&
           <> <NavBar username={userName ? userName.username : null} pic={userName ? userName.profile_pic : null} />
            <SideBar pic={userName ? userName.profile_pic : null} />


    
            {searcheduser? (
            <div className='bg-gray-100 min-h-screen flex flex-col items-center justify-center' style={{marginTop:'5%'}}>
                <div className='bg-white rounded-lg p-8 shadow-md text-center'>
                    <div className='mb-6'>
                    {searcheduser.user_data.profile_pic ? (
                        <img
                        className='rounded-circle w-32 h-32 object-cover border-4 border-white mx-auto mb-4'
                        src={searcheduser.user_data.profile_pic}
                        alt="User Profile"
                        style={{ width: '100px', height: '100px', marginTop: '2%' }}
                        onMouseOver={(e)=>{e.currentTarget.style.opacity='.5',e.currentTarget.style.cursor='pointer'}}
                        onMouseOut={(e)=>{e.currentTarget.style.opacity='1'}}
                        />
                    ) : (
                        <FontAwesomeIcon icon={faUser} className="text-5xl text-gray-500 mx-auto mb-4" />
                    )}
                    <h1 className='text-xl font-bold mb-2'>{searcheduser.user_data.username}</h1>

                            <div className='text-gray-600 mb-2 follow-stats'>
                    <div>
                        <p className='font-bold'>Followers</p>
                        <p className='text-xl'>{searcheduser.user_data.followers_count}</p>
                    </div>
                    <div>
                        <p className='font-bold'>Following</p>
                        <p className='text-xl'>{searcheduser.user_data.followings_count}</p>
                    </div>
                    <div>
                        <p className='font-bold'>Posts</p>
                        <p className='text-xl'>{searcheduser.posts.length}</p>
                    </div>
                    </div>

                    <div className='text-gray-600 mb-2'>
                    <p>Email: {searcheduser.user_data.email}</p>
                    {searcheduser.user_data.phone&&<p>Phone Number: {searcheduser.user_data.phone}</p>}
                { searcheduser.user_data.name&&<p>Name: {searcheduser.user_data.name}</p>}

                    </div>

                    <button type='button'
                    onClick={() => {
                        handleFollowUnfollow(searcheduser.user_data.id)
                    }}
                    style={{color: '#D15A5A',backgroundColor:'white',border:'2px solid black',borderRadius:'10px',padding:'auto',marginTop:'50px'}}
                    onMouseOver={(e)=>{e.currentTarget.style.backgroundColor='#D15A5A',e.currentTarget.style.color='black'}}
                    onMouseOut={(e)=>{e.currentTarget.style.backgroundColor='white',e.currentTarget.style.color='#D15A5A'}}
                    >
                    { searcheduser.user_data.is_following?"Unfollow":"Follow"}
                    </button>

                    {searcheduser.user_data.is_following &&(
                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                        {searcheduser.posts &&
                            searcheduser.posts.length > 0 &&
                            searcheduser.posts.map((p) => (
                                <Card style={{ width: '18rem', marginLeft: '20%', marginTop: '10px', marginBottom: '20px' }} key={p.id}>
                                    {p.post_media[0] &&
                                     <Card.Img variant="top" 
                                            src={p.post_media[0].media_file} 
                                            style={{ height: '100%', objectFit: 'contain' }}
                                            onClick={() => openMediaSliderModal(p.post_media)}
                                            />}


                                        <Card.Body style={{ marginLeft: '2px', marginBottom: '10px',textAlign: 'left' }}>
                                        <Card.Text>{p.caption}</Card.Text>
                                        <div style={{display:'flex', gap:'2rem'}}>
                                        <div className='like-btn' onClick={() => handleLike(p.id)}>
                                            <FontAwesomeIcon icon={faHeart} color={p.is_liked_or_not?'red' : 'black'} />
                                            <span className='ml-1'>{p.like_count}</span>

                                        </div>
                                        <div className='save-btn ml-4' onClick={() => handleSavedPost(p.id)}>{console.log(p.saved_or_not,"saved or not")}
                                            <FontAwesomeIcon icon={faBookmark} color={p.saved_or_not?'blue' : 'black'}/>
                                        </div>
                                        <div className='share-btn ml-4' onClick={() => openCommentModal(p.id)}>
                                                    <FontAwesomeIcon icon={faComment} />
                                        </div>
                                        </div>
                                    </Card.Body>
                                </Card>
                            ))}
                    </div>
                    )}



                    

                    </div>
                </div>
                
                {isCommentModalOpen && (
                    <CommentModal isOpen={isCommentModalOpen} onRequestClose={closeCommentModal} postId={selectedPostId} user={userName} />
                )}
              
            </div>
                
            ) : (
                
                <div>
                <Loader center content="loading" size='lg' />
                </div> 
            )}</>
            }

       {open && mediafiles && (
          <div className="fixed top-0 left-0  bg-transparent z-50 flex items-center justify-center">
             <button
          onClick={() => setOpen(false)}
          className="absolute text-black text-4xl cursor-pointer"
          style={{border:'1px solid red',backgroundColor:'red',marginLeft:'5%'}}
        >
         <FontAwesomeIcon icon={faClose}/>
        </button>
            <Carousel style={{ maxWidth: '50%',marginLeft:'20%',marginTop:'2%' }}>
              {mediafiles.map((media, index) => (
                <Carousel.Item key={index}>
                  <img
                    className="d-block w-100"
                    src={media.media_file}
                    alt={`slide-${index}`}
                    style={{ maxHeight: '700px' }}
                  />
                </Carousel.Item>
              ))}
            </Carousel>
          </div>
        )}
        </>
        

    )
    }

    export default ProfileOfOthers


