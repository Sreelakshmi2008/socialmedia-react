import React, { useState,useEffect } from 'react';
import './Posts.css';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser ,faHeart,faBookmark,faShare, faTrash, faComment} from '@fortawesome/free-solid-svg-icons';
import { Link ,useNavigate,useParams} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { baseUrl ,like,deletepost,mypost,user,likecount,createpost} from '../utils/constants';
import axios from 'axios';
import axiosInstance from '../utils/axiosInstance';
import NavBar from './NavBar';
import SideBar from './Sidebar';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import ReactBootstrapModal from 'react-bootstrap/Modal';
import ImageCropper from './ImageCropper';
import FollowUnfollowApi from '../api/FollowUnFollowApi';
import CommentModal from './CommentModal';


function Posts({username,posts,pic, isMypost}) {

  
  const [trigger, setTrigger] = useState(false);
  console.log(posts)
  const [userposts,setUserPosts] = useState(posts?posts:"null")
const navigate=useNavigate()
 useEffect(()=>{
  setUserPosts(posts?posts:"null")
  console.log("user posts updated",userposts)


 },[posts])


  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

//   console.log(user,posts,"post and user")
  function calculateTimeAgo(created_at) {
    const createdAtDate = new Date(created_at);
    const currentDate = new Date();
  
    const timeDifference = currentDate.getTime() - createdAtDate.getTime();
    const minutesAgo = Math.floor(timeDifference / (1000 * 60)); // Convert milliseconds to minutes
    const hoursAgo = Math.floor(minutesAgo / 60); // Convert minutes to hours
    const daysAgo = Math.floor(hoursAgo / 24); // Convert hours to days
  
    if (daysAgo > 0) {
      return `${daysAgo} day${daysAgo > 1 ? 's' : ''} ago`;
    } else if (hoursAgo > 0) {
      return `${hoursAgo} hour${hoursAgo > 1 ? 's' : ''} ago`;
    } else {
      return `${minutesAgo} minute${minutesAgo > 1 ? 's' : ''} ago`;
    }
  }
  const [postlike,setLike] = useState(JSON.parse(localStorage.getItem('postlike')) || {});

  const handleLike = async (id) => {
    try {
      console.log(id, "post id");
      const likeresponse = await axiosInstance.post(baseUrl + like, { id: id });
      console.log(likeresponse);
  
      const updatedLikeState = {
        ...postlike,
        [id]: {
          liked: likeresponse.data.message === 'You have liked this post',
          likecount: likeresponse.data.like_count,
        },
      };
      setLike(updatedLikeState);
      localStorage.setItem('postlike', JSON.stringify(updatedLikeState));
    } catch (error) {
      console.error('Error handling like:', error);
    }
  };
  const handleDeletepost = async (id) => {
    try {
      const response = await axiosInstance.delete(`${baseUrl}${deletepost}/${id}/`);
      console.log(response.data);
      
  const updatedPosts = posts.filter((post) => post.id !== id);
  console.log(updatedPosts)
  setUserPosts(updatedPosts)
     
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };
 
console.log(postlike.likecount,"count")


// modal for creating post
const [show, setShow] = useState(false);
const [selectedFiles, setSelectedFiles] = useState([]);
const [croppedImages, setCroppedImages] = useState([]);
const [currentFileIndex, setCurrentFileIndex] = useState(0);
const [showSelectMoreFiles, setShowSelectMoreFiles] = useState(true);
const [caption, setCaption] = useState('');
const [hashs, setHashs] = useState('');
const [showcaption,setShowCaption] =useState(false)

const handleCreatePostClick = () => {
  handleOpenCreateModal();
};

const handleOpenCreateModal = () => {
  console.log("clicked edit modal")
  setShow(true);
};
const handleCloseCreateModal = () => {
  setShow(false);
setSelectedFiles([]);
setCroppedImages([]);
setCurrentFileIndex(0);
 setShowSelectMoreFiles(false);
setCaption('');
setHashs('');
};

const handleFileSelect = (e) => {
  const file = e.target.files[0]
  console.log(file,"file reached")
  setSelectedFiles([...selectedFiles, file]);
  setShowSelectMoreFiles(false)
  
};


const handleCropComplete = async (croppedImageBlob) => {
  const updatedCroppedImages = [...croppedImages];
  updatedCroppedImages[currentFileIndex] = URL.createObjectURL(croppedImageBlob);
  setCroppedImages(updatedCroppedImages);
  setCurrentFileIndex((prevIndex) => prevIndex + 1);
  console.log('Updated Cropped Images:', updatedCroppedImages); // Log the updated array
   
  // Update showSelectMoreFiles state
  console.log('finish in createpost');
};

const handleSelectMoreFiles = () => {
setShowSelectMoreFiles(true)
  if (currentFileIndex < selectedFiles.length - 1) {
    setCurrentFileIndex(currentFileIndex + 1);
  }
};

const handleFinish = ()=>{
  setShowCaption(true)

}


const handleCreatePost = async () => {
  try {
    // Create FormData and append files
    const postData = new FormData();
    postData.append('caption', caption);
    postData.append('hashtags', hashs);

    const croppedImagesData = await Promise.all(
      croppedImages.map(async (file, index) => {
        const response = await fetch(file);
        const blob = await response.blob();
        const fileName = `croppedImage_${index}.png`; // You can generate a unique filename here
        postData.append('croppedImages', blob, fileName);
        return { blob, fileName };
      })
    );

    console.log([...postData.entries()]);

    // Send the data to the backend using Axios
    const response = await axiosInstance.post(baseUrl + createpost, postData);

    // Check if the post was successfully created
    if (response.status === 201) {
      console.log('Post created successfully:', response.data);
      navigate('/homepage');
      // Reset state and navigate to the 'myposts' page
      setSelectedFiles([]);
      setCroppedImages([]);
      setCaption('');
      setCurrentFileIndex(0);
      setShowSelectMoreFiles(false);
      setModalIsOpen(false);
       // Replace with the actual route for 'myposts'
    } else {
      console.error('Failed to create post:', response.data);
    }
  } catch (error) {
    console.log(error);
  }
};


// follow and unfollow api call
const [userfollow,setuserfollow] = useState({})
const handleFollowUnfollow = async (userId) => {
  try {
    const followresponse =await FollowUnfollowApi(userId);
   
      const updatedFollowState = {
        ...userfollow,
        [userId]: {
          follow: followresponse.detail === 'You are now following this user.',
          
        },
      };
     
    setuserfollow(updatedFollowState)
    
    
    setTrigger(false);
  } catch(e){
    console.log(e)
    console.log("follow/unfollow got error");
  }
};



// comment click
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


  return (
<>

  
 <div>
        {isMypost&&<div className='frame1'>
        <div className='post-top'>
        {pic?<img src={'http://localhost:8000'+pic} alt="Profile" />:<FontAwesomeIcon icon={faUser} className="text-black" />}

          <span className='profile_name'>{username.username}</span>
          <span className='timestamp'>Now</span>
        </div>
        <div className='postmedias'>
          <button type="button" className="create-post-btn" onClick={handleCreatePostClick}>Create Your Post</button>
        </div>
      </div>}
    
      {userposts.map((post) => (
        <div key={post.id} className='frame1'>
          <div className='post-top'>
          {post.user.profile_pic?<img src={ post.user.profile_pic} alt="Profile" />:<FontAwesomeIcon icon={faUser} className='text-black profile-image' />}
            <span className='profile_name'>{post.user.username}</span>
            <span className='timestamp'>{calculateTimeAgo(post.created_at)}</span>
            {username.id!==post.user.id &&
            <button 
                  onClick={() => {
                    handleFollowUnfollow(post.user.id);
                    setTrigger(true);
                  }}
                  className= "follow-btn "
                  style={{
                    color: userfollow[post.user.id]?.follow ? "red" : "blue",
                  }}
                   

                  
                >{console.log(userfollow,"user folow")}
                  { userfollow[post.user.id]?.follow ? "Unfollow" : "Follow"}
                </button>
}
              

          </div>
          <div className='postmedias'>
            <Slider {...sliderSettings}>
              {post.post_media.map((media,index) => (
                <div key={index}>
                  {console.log(media.media)}
               {media.media_file && (
              <img src={media.media_file} alt="Post" className='post-image mb-3 rounded-md' />
            )}                </div>
              ))}
            </Slider>

            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
  {post.hashtags.map((hash, index) => (
    <h3 key={index} style={{ margin: '0', marginRight: '5px' }}>
      #{hash.hashtag}
    </h3>
  ))}
</div>

            <h3>{post.caption}</h3>
            
          </div>
          <div className='flex items-center justify-between mt-1'>
        <div className='post-actions'>
          <div className='like-btn' onClick={() => handleLike(post.id)}>
          <FontAwesomeIcon icon={faHeart} color={postlike[post.id]?.liked ? 'red' : 'black'} />
                  <span className='ml-1'>{postlike[post.id]?.likecount}</span>

          </div>
          <div className='save-btn ml-4'>
            <FontAwesomeIcon icon={faBookmark} />
          </div>
          <div className='share-btn ml-4' onClick={() => openCommentModal(post.id)}>
                    <FontAwesomeIcon icon={faComment} />
          </div>
          
          <div className='share-btn ml-4'>
            <FontAwesomeIcon icon={faShare} />
          </div>
          {isMypost&&
          <div className='delete-btn' style={{ marginLeft: 'auto',marginRight:'20px' }} onClick={()=>handleDeletepost(post.id)}>
            <FontAwesomeIcon icon={faTrash} color='red' />
          </div>}

        </div>
      </div>
        </div>
      ))}
    </div>


    
    <ReactBootstrapModal show={show} onHide={handleCloseCreateModal}
    size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <ReactBootstrapModal.Header closeButton>
        <ReactBootstrapModal.Title id="contained-modal-title-vcenter">
          Create Your Post<h2>{showSelectMoreFiles}</h2>{console.log(showSelectMoreFiles,"morefiles")}
        </ReactBootstrapModal.Title>
      </ReactBootstrapModal.Header>
      <ReactBootstrapModal.Body>
      {showSelectMoreFiles&&(
      <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Select File</Form.Label>
              <Form.Control
                type="file"
                accept="image/*" 
                onChange={handleFileSelect}
                autoFocus
              />
            </Form.Group>
        </Form>)}
        {showcaption&&(
      <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Enter Caption</Form.Label>
              <Form.Control
                type="text"
                value={caption}
                onChange={(e)=>setCaption(e.target.value)}
                autoFocus
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Enter Hashtags</Form.Label>
              <Form.Control
                type="text"
                value={hashs}
                onChange={(e)=>setHashs(e.target.value)}
                autoFocus
              />
            </Form.Group>
        </Form>)}
        {currentFileIndex < selectedFiles.length ? (
            // Main component
            <div
              style={{
                width: '80%',
                height: '90%',
              }}
            >
            
              <ImageCropper src={URL.createObjectURL(selectedFiles[currentFileIndex])} onCropComplete={handleCropComplete} />
            </div>
          ) : (null)}
            {currentFileIndex>=selectedFiles.length&&  !showSelectMoreFiles&&!showcaption&&
              <div style={{
                width: '80%',
                height: '50%',
                margin:'0 auto'
              }}>
              <Slider {...sliderSettings}>
              {croppedImages.length > 0 &&
                  croppedImages.map((image, index) => (
                    <div key={index}>
                      <img src={image} alt={`Cropped ${index}`} style={{ maxWidth: '100%', maxHeight: '100%' }} />
                    </div>
                  ))}
            </Slider>
            
               
                  </div>}
      </ReactBootstrapModal.Body>
      <ReactBootstrapModal.Footer>
        {currentFileIndex>=selectedFiles.length&&  !showSelectMoreFiles&&!showcaption&&
             <> <Button onClick={handleSelectMoreFiles}>Select More files</Button>
              <Button onClick={handleFinish}>Next</Button></>

}

{showcaption&& <Button onClick={handleCreatePost}>Create Post</Button>
}
        <Button onClick={handleCloseCreateModal}>Close</Button>
      </ReactBootstrapModal.Footer>
      </ReactBootstrapModal>
      {console.log(isCommentModalOpen,"open triggered")}
      {isCommentModalOpen && (
    <CommentModal isOpen={isCommentModalOpen} onRequestClose={closeCommentModal} postId={selectedPostId} user={username} />
  )}
    </>
  );
}

export default Posts;
