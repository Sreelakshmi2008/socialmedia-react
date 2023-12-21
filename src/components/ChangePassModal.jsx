import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import createCommentApi from "../api/createCommentApi";
import {  base, baseUrl } from "../utils/constants";
import { RiDeleteBin6Line } from "react-icons/ri";
// import { AiOutlineSend } from "react-icons/ai";
import CommentDeleteApi from "../api/CommentDeleteApi";
import axiosInstance from "../utils/axiosInstance";
import Modal from 'react-modal'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose ,faTrash,faUser} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";




const ChangePassModal = ({ isOpen, onRequestClose,user,onPasswordChangeSuccess}) => {
  const [pass2, setPass2] = useState();
  const [pass1, setPass1] = useState();
   const [trigger,setTrigger] = useState(false)
  const [otp, setOtp] = useState(false);
  const [otpsent, setOtpsent] = useState();

  const [otpverify,setOtpverify] = useState(false)
const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    console.log(otpsent,"otp type")
      try {
        await axiosInstance.post(`${baseUrl}api/verifyotp`,{'otp':otpsent});

        toast.success("Otp verified", {
          position: "top-center",
        });
        
        setOtpverify((prevOtpverify) => !prevOtpverify);
        setOtp(false)
      console.log("otp verify state changed",otpverify)
        setOtpsent();
        
      } catch (error) {
        toast.error("Failed to verify otp", {
          position: "top-center",
        });
        navigate('/profile')
        
      }
    
  };

  const handleSendClick = async()=>{
    try{
    console.log(`${baseUrl}api/sentotp`)
    await axiosInstance.get(`${baseUrl}api/sentotp`)

    toast.success("Otp sent")
    setOtp(true)
    }catch(error)
    {   
        toast.error("Try agian")
        console.log(error)
    }

  }
  
  const handleSubmitPassword = async (e) => {
    e.preventDefault(); 
    if (pass1===pass2) {
      try {
        await axiosInstance.patch(`${baseUrl}api/changepass`,{'password':pass1})
        
        setOtpverify(false)
        onPasswordChangeSuccess(); 
        toast.success("Password changed succesfully", {
            position: "top-center",
          });
        
      } catch (error) {
        toast.error("Failed to Change password", {
          position: "top-center",
        });
      }
    }
    else{
        toast.error("Passwords donot match", {
            position: "top-center",
          });    }
  };

  console.log(otpverify,"otpveify")
  return (
    <Modal
    isOpen={isOpen}
    onRequestClose={onRequestClose}
    contentLabel="Add Comment Modal"
    style={{
      overlay: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft:'25%',
        
     
      },
      content: {
        width: '50%', 
        height: '50%', 

        border: '3px solid rgba(209, 90, 90, 0.5)',
        borderRadius:'15px',
        filter: 'drop-shadow(10px 10px 10px rgba(0, 0, 0, 0.5))',
      },
    }}
  >

<button
        onClick={onRequestClose}
      >
       <FontAwesomeIcon icon={faClose}/>
      </button>
   {!otp && !otpverify&&
        <div style={{marginTop:'10%'}}>
            <h3>Send an Otp to registered phone number {user.phone} </h3>
            <button onClick={handleSendClick}
            className="btn"
            style={{backgroundColor:'rgba(209, 90, 90, 0.5)',border:'2px solid rgba(209, 90, 90, 0.5)',marginTop:'10%',marginLeft:'45%'}}>
                Send</button>
        </div>
}

{otp && !otpverify &&
    <div style={{marginTop:'20%',width:'90%',marginLeft:'10%'}}>
    <form
      onSubmit={(e) => {
        handleSubmit(e);
    
      }}
      
    >
      <input
        value={otpsent}
        onChange={(e) => setOtpsent(e.target.value)}
        placeholder="Otp"
        rows="1"
        style={{width:'90%',borderRadius:'5px',border:'2px solid rgba(209, 90, 90, 0.5)',padding:'5px'}} />
      <button
        type="submit"
        className="py-2 px-4 ml-4 btn"
        style={{marginTop:'10%',borderRadius:'5px',backgroundColor:'rgba(209, 90, 90, 0.5)',padding:'5px',marginLeft:'30%'}}
      >Verify Otp</button>
    </form>
    
    </div>
     
   
}

{otpverify && !otp&&
    <form
      onSubmit={(e) => {
        handleSubmitPassword(e);
    
      }}
      className="items-end"
      style={{marginTop:'10%',marginLeft:'10%'}}
    >
      <input
        value={pass1}
        onChange={(e) => setPass1(e.target.value)}
        placeholder="Password"
        rows="1"
        type='password'
        style={{width:'90%',borderRadius:'5px',border:'2px solid rgba(209, 90, 90, 0.5)',padding:'5px'}} />
         <input
        value={pass2}
        onChange={(e) => setPass2(e.target.value)}
        placeholder="Confirm Password"
        rows="1"
        type='password'
        style={{width:'90%',borderRadius:'5px',border:'2px solid rgba(209, 90, 90, 0.5)',padding:'5px',marginTop:'10%'}} />
      <button
        type="submit"
        className="py-2 px-4 ml-4"
        
        style={{marginTop:'10%',borderRadius:'5px',backgroundColor:'rgba(209, 90, 90, 0.5)',padding:'5px',marginLeft:'40%'}}
      >Change</button>
    </form>
}
  </Modal>



    )
  
};

export default ChangePassModal;