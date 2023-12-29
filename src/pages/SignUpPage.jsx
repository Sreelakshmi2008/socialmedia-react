import { useState,useEffect,useRef } from 'react';
import './SignUpPage.css';
import axios from 'axios';
import {baseUrl,register} from '../utils/constants';
import { useNavigate,Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import ImageCropper from '../components/ImageCropper';
import FileUploader from '../components/FileUploader';
import { toast } from 'react-toastify';
import { Modal, Button } from 'react-bootstrap'; // Import modal components
import 'bootstrap/dist/css/bootstrap.min.css';


// Your additional SCSS styles go here



function SignUp(){

    const navigate = useNavigate() 
    const [errors, setErrors] = useState({});
    const [emailError, setEmailError] = useState("");
    const [showCropper, setShowCropper] = useState(false); // State to control modal visibility

  const handleShowCropper = () => setShowCropper(true);
  const handleCloseCropper = () => setShowCropper(false);


    // function which sends data to backend signup view function
    const signupUser = async (credentials) => {
        try {
          
            const response = await axios.post(baseUrl + register, credentials, {
              headers: {
                'Content-Type': 'multipart/form-data',  // Important for handling files
              },
            });
         
          console.log(response.data);
          navigate('/')
        } catch (error) {
          setErrors(error.response.data);
          console.error(error.response.data);
          Object.keys(errors).forEach(field => {
            console.log(field)
            if(field=="email"){
              toast.error(`Email : ${errors[field][0]}`);
            }
            else if(field=="username"){
              toast.error(`Username: ${errors[field][0]}`);
            }
           
            else if(field=="phone"){
              toast.error(`Phone: ${errors[field][0]}`);
            }
            else if(field=="profile_pic"){
              toast.error(`Profile Picture: ${errors[field][0]}`);
            }
            else if(field=="password"){
              toast.error(`Password: ${errors[field][0]}`);
            }
           
          
          
        });

         
        }
    }
    console.log(emailError,"email error")
    
    // setting states for each input in form
    const [first,setFirst]=useState("");
    const [last,setLast]=useState("");
    const [email,setEmail]=useState("");
    const [phone,setPhone]=useState("");
    const [pass1,setPass1]=useState("");
    const [pass2,setPass2]=useState("");
    const [profile_pic,setProfile] = useState(null)
    const [croppedImage, setCroppedImage] = useState(null);
const[ImageCropperSrc,setImageCropperSrc]=useState(null)
  
    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setProfile(file);
    
        // Convert the file to a Blob (if needed)
        const blob = new Blob([file], { type: file.type });
    
        // Use createObjectURL with the Blob
        const objectUrl = URL.createObjectURL(blob);
    
        // Set the objectUrl as the source for ImageCropper
        setImageCropperSrc(objectUrl);
    
        handleShowCropper(); // Open the modal when a file is selected
      }
      
    };

 
    const handleCropComplete = (croppedImageBlob) => {
      setCroppedImage(URL.createObjectURL(croppedImageBlob));

      handleCloseCropper(); // Close the modal after cropping

    };

   
    //   when submit form this fun is called
    const handleSubmit = async (event) => {
        event.preventDefault();

          // Check if email is empty
          if (!email.trim()) {
            setEmailError("Email is required");
            return;
        }
        else if(!email.includes('@')){
          setEmailError("Email Format not required");
            return;

        }
       
        // Clear previous email error if any
        setEmailError("");

        if (phone.trim() && !/^\d{10}$/.test(phone)) {
          toast.error('Phone number must be 10 digits.');
          return; // Prevent form submission
      }

        // if passwords matches, then we fetch all the data in form and send it to signup function
        if(pass1===pass2){
    
        const formData = new FormData();

        // Append each field to the FormData object
        formData.append('username', first);
        formData.append('name', last);
        formData.append('email', email);
        formData.append('phone', phone);
        formData.append('password', pass1);
         
        
        const croppedImageData = await (async () => {
          const response = await fetch(croppedImage);
          const blob = await response.blob();
          const fileName = 'croppedImage.png'; // You can generate a unique filename here
          formData.append('profile_pic', blob, fileName);
          return { blob, fileName };
        })();
        
       

        console.log(formData)
        // Call your signup function
        await signupUser(formData);
       
        }

        // if passwords donot match, alert users
        else{
            toast.error("Passwords donot match")
        }


    };


    

        return(
          <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="box mt-5">
            <h1 className="title2 text-center">Create Your Account</h1>
            <form className='signupForm' onSubmit={handleSubmit} encType="multipart/form-data">
              <div className="form-group">
                <label className='first_label'>Username</label>
                <input className='form-control first_name' type='text' placeholder='Username.......' value={first} onChange={(e) => setFirst(e.target.value)} />
              </div>

              <div className="form-group">

                <label className='last_label'>Name</label>
                <input className='form-control last_name' type='text' placeholder='Your Name.......' value={last} onChange={(e) => setLast(e.target.value)} />
              </div>

              <div className="form-group">
              {/* <span className='error_input'>{emailError? emailError: ""}</span> */}
                <label className='email_label'>Email</label>
                <input className={`form-control email_input ${emailError ? 'error' : ''}`} type='text' placeholder="email......." value={email} onChange={(e) => setEmail(e.target.value)} />
                
        
              </div>

              <div className="form-group">
                <label className='phone'>Phone Number</label>
                <input className='form-control phone_input' type='text' placeholder='Phone Number......' value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>

              <div className="form-group">
                <label className='pass1'>Password</label>
                <input className='form-control pass1_input' type='password' placeholder='Password.......' value={pass1} onChange={(e) => setPass1(e.target.value)} />
              </div>

              <div className="form-group">
                <label className='pass2'>Confirm Password</label>
                <input className='form-control pass2_input' type='password' placeholder='Confirm Password.......' value={pass2} onChange={(e) => setPass2(e.target.value)} />
              </div>
              <div className="form-group">
               
                  {profile_pic ? (
                <div className="form-group">
                  {/* Display the cropped image preview */}
                  <img
                    src={croppedImage}
                    alt="Cropped Preview"
                    style={{ maxWidth: '100px', maxHeight: '100px' }}
                  />
                </div>
              ):(<> <label className="profile">Select your profile pic</label>
              <input
                type="file"
                accept="image/*"
                className="form-control-file profile_pic"
                onChange={handleFileChange}
              /></>)}

            

              </div>
              
              <button className='btn btn-block create pt-0' type='submit'>Create Account</button>
            </form>

            <p className="text-center mt-3">
              <Link className='link2' to="/">Sign in to your account</Link>
            </p>
          </div>
        </div>
      </div>
       {/* Modal for ImageCropper */}
       <Modal show={showCropper} onHide={handleCloseCropper}>
        <Modal.Header closeButton>
          <Modal.Title>Crop Image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ImageCropper
            src={ImageCropperSrc}
            onCropComplete={handleCropComplete}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseCropper}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>

    );
}

export default SignUp;
