import { Navigate, Route, Routes } from "react-router-dom";
import AdminLogin from "../pages/AdminLogin";
import AdminDash from "../pages/AdminDash";
import UserDetail from "../pages/userDetails";
import AdminUserPosts from "../pages/AdminUserPosts";
import AdminUserPostsDetails from "../pages/AdminUserPostDetails";
import {PrivateRoutesAdmin} from "../components/PrivateComponent"
import AdminPosts from "../pages/AdminPosts";
import NotFoundPage from "../components/404Page";
import BarChart from "../pages/AdminChart";
function AdminRouter(){
    
   
    return(




    <Routes>
      <Route path='/' element={<AdminLogin/>}/>
      
      <Route element={<PrivateRoutesAdmin />}>
                <Route path='/admindash' element={<AdminDash/>}/>
                <Route path='/admin_user/:userEmail' element={<UserDetail/>}/>
                <Route path='/admin_user_posts/:userEmail' element={<AdminUserPosts/>}/>
                <Route path='/admin_user_posts_details/:id' element={<AdminUserPostsDetails/>}/>
                <Route path='/posts' element={<AdminPosts/>}/>
                <Route path='/chart' element={<BarChart/>}/>
                {/* <Route path='/comment_by_post' element={<AdminComment/>}/> */}
                



     </Route>
    </Routes>
  );
}

export default AdminRouter
