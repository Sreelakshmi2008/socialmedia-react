import { Route, Routes, Navigate } from "react-router-dom";
import Landing from "../pages/LandingPage";
import SignUp from "../pages/SignUpPage";
import Home from "../pages/HomePage";
import Profile from "../pages/ProfilePage";
import MyPosts from "../pages/MyPosts";
import {PrivateRoutes} from "../components/PrivateComponent";
import Chat from "../components/chatting";
import NotFoundPage from "../components/404Page";
import FollowersList from "../pages/FollowersList";
import FollowingListPage from "../pages/FollowingsList";
import UserSavedPosts from "../pages/UserSavedPost";
import ProfileOfOthers from "../components/ProfileOfOthers";
function UserRouter() {
  return (
    <Routes>
      <Route path='/' element={<Landing />} />
      <Route path='/register' element={<SignUp />} />
    
      <Route path='*' element={<NotFoundPage/>} />

      <Route element={<PrivateRoutes />}>
                <Route element={<Home/>} path="/homepage"/>
                <Route element={<Profile/>} path="/profile"/>
                <Route element={<FollowersList/>} path="/followers"/>
                <Route element={<FollowingListPage/>} path="/followings"/>

                <Route path='/myposts' element={<MyPosts />} />
                <Route path='/user-saved-posts' element={<UserSavedPosts />} />
                <Route path='/chat' element={<Chat />} />
                <Route path="/authors/:id" element={<ProfileOfOthers/>} />

     </Route>
    </Routes>
  );
}

export default UserRouter;
