import './AdminSide.css';
import { baseUrl} from '../utils/constants';
import { Link } from 'react-router-dom';



function AdminSide(){
    return(
        <div className="admin_box">
            
            <h1 className="admin_side_title_txt">Admin</h1>
          
            <ul>
                    <li className="admin_dash_link">Dashboard</li>
                    <li className="admin_user"><Link to='/admin/admindash' className='admin_user_link'>Users</Link></li>
                    <li className="admin_user"><Link to='/admin/posts' className='admin_user_link'>Posts</Link></li>

            </ul>
            
          


        </div>
    )
}


export default AdminSide