import React, { useEffect, useState } from 'react';
import { baseUrl,user,mypost,recommended } from '../utils/constants';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance'
import NavBar from '../components/NavBar';
import { Loader,Placeholder} from 'rsuite';
import './loader.css'
import SideBar from '../components/Sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import './FollowingsList.css';
import FollowUnfollowApi from '../api/FollowUnFollowApi';

const FollowingListPage = () => {
  
  const [following, setFollowing] = useState([]);
  const navigate = useNavigate()
  const [userName, setUserName] = useState(null);
  const [userposts, setUserposts] = useState([]);
  const [recommendedposts, setRecomposts] = useState([]);

  useEffect(() => {
  
    
    const fetchData = async () => {
      try {
      
       
        const response = await axiosInstance.get(baseUrl + user);
        const postresponse = await axiosInstance.get(baseUrl + mypost);
        const recommendedResponse = await axiosInstance.get(baseUrl + recommended);

        const userdata = response.data

        setUserName(response.data);
        setUserposts(postresponse.data);
        setRecomposts(recommendedResponse.data);

        if(userdata){
          
          axiosInstance
          .get(`${baseUrl}posts/followings/${userdata.id}/`)
          .then((response) => {
            if(response.data.length>0){
            setFollowing(response.data);
            }
            else{
              console.log("no followings")
            }
          })
          .catch((error) => {
            console.error('Error fetching following:', error);
          });
        }
        else{
          console.log("error getting user data")
        }


      } catch (error) {
        console.error('Error:', error);
      }      
    };
  
    fetchData();
  }, []);


   
  // Filter following based on search query
  const filteredFollowing = following.filter((followingUser) =>
    followingUser.following.username.toLowerCase()
  );

  const [userfollow,setuserfollow] = useState({})
const handleFollowUnfollow = async (userId) => {
  try {
    const followresponse =await FollowUnfollowApi(userId);
    const updatedFollowing = following.filter((user) => user.following.id !== userId);

      setFollowing(updatedFollowing);
      const updatedFollowState = {
        ...userfollow,
        [userId]: {
          follow: followresponse.detail === 'You are now following this user.',
          
        },
      };
     
    setuserfollow(updatedFollowState)
    
  } catch(e){
    console.log(e)
    console.log("follow/unfollow got error");
  }
};


  return (
    <>
  {userName && userposts ? (
      <>
        <NavBar username={userName.username} pic={userName.profile_pic} />
        <SideBar pic={userName.profile_pic} post={userposts} />
        <h2 className="mt-4" style={{marginLeft:'25%'}}>Followings</h2>
        <div className='div-table-followings'>
 
  <table className="border-collapse bg-slate-500 shadow-md table-followings" style={{ width: '70%'}}>
    <tbody>
      {filteredFollowing.map((followingUser) => (
        <tr key={followingUser.id}>
          <td style={{ paddingLeft: '100px', paddingRight: '10px',width:'80px'}}className='py-4'> 
            {followingUser.following.profile_pic ? (
              <img
                src={followingUser.following.profile_pic}
                alt={`${followingUser.following.username}'s profile`}
                style={{ width: '39px', height: '39px', borderRadius: '50%' }}
                onClick={() => navigateToAuthorProfile(followingUser.following.id)}
              />
            ) : (
              <FontAwesomeIcon
                icon={faUser}
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  border: '1px solid black',
                  padding: '5px',
                }}
              />
            )}
          </td>
          <td className="py-4" onClick={() => navigateToAuthorProfile(followingUser.following.id)}>
            {followingUser.following.username}
          </td>
          <td className="py-4"
          style={{paddingLeft:'300px'}}> {/* Increase paddingRight */}
            <button type='button'
                  onClick={() => {
                    handleFollowUnfollow(followingUser.following.id)
                  }}
                  style={{color: '#D15A5A',backgroundColor:'white',border:'2px solid black',borderRadius:'10px',padding:'auto'}}
                  onMouseOver={(e)=>{e.currentTarget.style.backgroundColor='#D15A5A',e.currentTarget.style.color='black'}}
                  onMouseOut={(e)=>{e.currentTarget.style.backgroundColor='white',e.currentTarget.style.color='#D15A5A'}}
                   >
                  UnFollow
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>



    
        
      </>
    ) : (
      // Loading state or alternative content
      <div>
      <Loader center content="loading" size='lg' />
    </div> 
    )}
    </>
   
  );
};

export default FollowingListPage;