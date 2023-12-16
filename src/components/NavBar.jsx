import React from 'react';
import './NavBar.css';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUser } from '@fortawesome/free-solid-svg-icons';
import { base, baseUrl } from '../utils/constants';

function NavBar({ username,pic}) {
  return (
    <div className='navbar navbar-expand-lg navbar-light'>
      <Link to="/homepage" className='navbar-brand'>Name</Link>
      <div className='collapse navbar-collapse d-flex justify-content-end align-items-center'>
        <div className='navbar-nav'>
            <div className="input-group rounded">
              <input type="search" className="form-control rounded" placeholder="Search" aria-label="Search" aria-describedby="search-addon" />
              <span className="input-group-text border-0" id="search-addon">
                <FontAwesomeIcon icon={faSearch} className="text-black" />
              </span>
            </div>
        </div>
        <div className='nav_profile'>
          {pic ? (
            <img src={base+ pic} alt="Profile" className='rounded-circle'  />
          ) : (
            <FontAwesomeIcon icon={faUser} className="text-black nav_image" />
          )}
          <span className=''>Hi........{username}</span>
        </div>
      </div>
    </div>
  );
}

export default NavBar;
