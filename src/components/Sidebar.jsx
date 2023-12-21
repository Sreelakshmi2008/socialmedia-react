import './SideBar.css';
import { base, baseUrl} from '../utils/constants';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch,faUser,faPhotoFilm, faBookmark, faPeopleGroup, faEnvelope, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';


function SideBar({pic,post,user}){
    
    const navigate = useNavigate()
    const handleUserLogout = ()=>{
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('refreshjwtToken');

    
        navigate('/')
      }

    return(
        <div className="box2">
            <div className='myprofile'>
                
            {pic?<img src={base + pic} alt="Profile" />:<FontAwesomeIcon icon={faUser} className="text-black" />}
                            <Link className="myprofile_text" to='/profile'>My Profile</Link>
            </div>
            <div className='myposts'>
            <FontAwesomeIcon icon={faPhotoFilm} style={{color: "#000000",}} />
            <Link  className="myposts_text" to='/myposts'   >My Posts</Link>
            </div>
            <div className='savedpost'>
            <FontAwesomeIcon icon={faBookmark} style={{color: "#000000",}} />
                <Link className="savedpost_text" to='/user-saved-posts'>Saved Posts</Link>
            </div>
            <div className='followers'>
            <FontAwesomeIcon icon={faPeopleGroup} style={{color: "#000000",}} />
                <Link className="followers_text" to='/followers'>Followers</Link>

            </div>
            <div className='following'>
            <FontAwesomeIcon icon={faPeopleGroup} style={{color: "#000000",}} />
                <Link className="following_text" to='/followings'>Followings</Link>
            </div>
            <div className='messages'>
            <FontAwesomeIcon icon={faEnvelope} style={{color: "#000000",}} />
                  <Link className="messages_text" to='/chat'>Messages</Link>

            </div>
            <div className='logout'>
            <FontAwesomeIcon icon={faRightFromBracket} style={{color: "#000000",}} />
                  <button className="logout_link" onClick={handleUserLogout}>Log Out</button>
            </div>
              
           



        </div>
    )
}


export default SideBar