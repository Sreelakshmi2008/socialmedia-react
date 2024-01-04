import './LandingPage.css'
import { useEffect, useState } from 'react';
import { useNavigate,Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { UserLogin } from '../redux/reducers/UserAuthSlice';
import axios from 'axios'
import { baseUrl,login,google } from '../utils/constants';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { googleLogout, useGoogleLogin,GoogleLogin } from '@react-oauth/google';


function Landing(){


    const navigate = useNavigate()
   
    useEffect(()=>{
    const isLoggedIn = localStorage.getItem('jwtToken');
    if (isLoggedIn) {
        navigate('/homepage');  // Redirect to the homepage
    }
   
    },[])
    const loginUser = async (credentials) => {
        try {
          const response = await axios.post(baseUrl+login, credentials);
          console.log(response.data);
          localStorage.setItem('jwtToken', response.data.access);
          localStorage.setItem('refreshjwtToken', response.data.refresh);
    
          navigate('/homepage');
          toast.success("Succesfully Logged in")
          
          
        } catch (error) {
          console.error(error);
          
          if (error.response && error.response.status === 401) {
            // Server responded with a 401 status, meaning authentication failed
            toast.error(error.response.data.details);
        } else {
            // Handle other errors, such as network issues
            toast.error("An error occurred. Please try again later.");
        }
        }
      };
    
    const [email_or_username, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
      const handleSubmit = async (event) => {
        event.preventDefault();
        console.log(email_or_username,password,"state")
     
        const formData = {
          email_or_username,password
        };
      
        // Call your login function
        await loginUser(formData);
       
      };
    
      
   
        const onGoogleLoginSuccess= async(codeResponse) => {
            console.log(codeResponse,"coderesponse");
            const google_token  =codeResponse.credential

            try{
            const googleuser = await axios.post(baseUrl+google,{'google_token':google_token})
            console.log('User Details:', googleuser);
            localStorage.setItem('jwtToken', googleuser.data.access);
            localStorage.setItem('refreshjwtToken', googleuser.data.refresh);
      
            navigate('/homepage')
            toast.success(`Authenticated as ${googleuser.data.email_or_username}`)

            }catch(error){
                console.error
                toast.error(error.response.data.details)


            }
          
        }
      
        const onGoogleLoginFailure = (error) => console.log('Login Failed:', error)
    

    return(
      <>
       <div className="container">
          <div className="row">
              <div className="col-md-6 first">
                  <div className='rect1'></div>
                  <div className='rect2'></div>
                  <div className='rect3'></div>
                  <div className='rect4'></div>
                  <h1 className='welcome'>Welcome !!!</h1>
                  <h1 className='tagline'>Get connected with people</h1>
              </div>
              <div className="col-md-6 second">
                  <div className='rectangle'>

                      <h1 className='title'>Nameee</h1>
                      <form onSubmit={handleSubmit}>
                          <input type='text' className='email form-control' placeholder='Username or Email.......'
                              value={email_or_username} onChange={(e) => setEmail(e.target.value)} />
                          <input type='password' className='password form-control' placeholder='Password.......'
                              value={password} onChange={(e) => setPassword(e.target.value)} />
                          <button className='login btn pt-1' type='submit'>Login</button>
                      </form>

                      {/* <a className='forgot' href="#">Forgot password???</a> */}
                      <span className='text'>If you dont have one, create your account here........
                          <Link to="/register" className='link'>signup</Link>
                      </span>
                                           
                  </div>
                  <div className='google-button'>  
                        
                        <GoogleLogin clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID} 
                        onSuccess={onGoogleLoginSuccess}
                        onFailure={onGoogleLoginFailure} />
                  </div>
              </div>
          </div>
      </div>

         
      </>

    );
}

export default Landing;
