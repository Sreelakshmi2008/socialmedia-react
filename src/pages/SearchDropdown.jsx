// UserSearchDropdown.js
import React from 'react';
import { base } from '../utils/constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';



const UserSearchDropdown = ({ users, handleUserClick ,isadmin}) => {


  const navigate = useNavigate()

  const navigateToAuthorProfile = (userId,userEmail) => {
    console.log(userEmail,"the coming userid")
    if(isadmin){
      navigate(`/admin/admin_user/${userEmail}`)
    }
    else{
      navigate(`/authors/${userId}`);
    }
   
    handleUserClick()
  };

  
  return (
    <div className="user-search-dropdown"  style={{ maxHeight: '400px', overflowY: 'scroll' }}>
      <table className="border-collapse bg-slate-500 shadow-md table-followings" style={{ width: '70%'}}>
    <tbody>
      {users.map((user) => (
        <tr key={user.id}>
          <td style={{ paddingLeft: '50px', paddingRight: '10px',width:'80px'}}className='py-4'> 
            {user.profile_pic ? (
              <img
                src={base + user.profile_pic}
                alt={`${user.username}'s profile`}
                style={{ width: '39px', height: '39px', borderRadius: '50%' }}
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
          <td className="py-4" onClick={() => navigateToAuthorProfile(user.id,user.email)}  style={{ whiteSpace: 'nowrap' }}>
          <strong>{user.username}</strong>
            <br />{user.name}
          </td>
          {/* {!isadmin &&
          <td className="py-4"
          style={{paddingLeft:'100px'}}>
            <button type='button'
                  onClick={() => {
                    handleFollowUnfollow(user.id)
                  }}
                  style={{color: '#D15A5A',backgroundColor:'white',border:'2px solid black',borderRadius:'10px',padding:'auto'}}
                  onMouseOver={(e)=>{e.currentTarget.style.backgroundColor='#D15A5A',e.currentTarget.style.color='black'}}
                  onMouseOut={(e)=>{e.currentTarget.style.backgroundColor='white',e.currentTarget.style.color='#D15A5A'}}
                   >
                  UnFollow
            </button>
          </td>
} */}
        </tr>
      ))}
    </tbody>
  </table>
    </div>
  );
};

export default UserSearchDropdown;
