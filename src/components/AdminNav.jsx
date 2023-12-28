import './AdminNav.css';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { baseUrl} from '../utils/constants';
import { useState,useEffect } from 'react';
import axiosInstanceAdmin from "../utils/axiosInstanceAdmin";
import UserSearchDropdown from '../pages/SearchDropdown';
function AdminNav() {

  const navigate = useNavigate()

  const handleLogout = ()=>{
    localStorage.removeItem('jwtTokenAdmin');
    localStorage.removeItem('refreshjwtTokenAdmin');


    navigate('/admin')
  }


  const [showDropdown, setShowDropdown] = useState(false);
  const [search_user_query,setSearchUserQuery]=useState('')
  const [searchUsers,setSearchUsers]=useState([])
 const handleSearch = async()=>{
    const response = await axiosInstanceAdmin.get(`${baseUrl}api/search/?query=${search_user_query}`)
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
    <div className='admin_navbar'>
        <div className="input-group md-form form-sm form-1 pl-0">
          <div className="input-group-prepend">
            <span className="input-group-text pink lighten-3" id="basic-text1">
              <FontAwesomeIcon icon={faSearch} className="text-black" onClick={handleSearch}/>
            </span>
          </div>
          <input className="form-control my-0 py-1 small-input" type="text" placeholder="Search........." aria-label="Search" 
           value={search_user_query} onChange={(e)=>setSearchUserQuery(e.target.value)}/>
        </div>
        {showDropdown && searchUsers.length > 0 && (
              <div className='searchDrop'>
            <UserSearchDropdown users={searchUsers} handleUserClick={handleUserClick} isadmin={true}/>
            </div>
          )}  
      <div className='admin_logout'>
      
        <span onClick={handleLogout} className='logout_link'>Log Out</span>
      </div>
    </div>
  );
}

export default AdminNav;
