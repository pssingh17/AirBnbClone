import React,{useEffect, useState} from "react";
import { Link } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { useDispatch } from 'react-redux'
import {userData} from "../../UserDataReducer/UserDataSlice";
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import { LoaderStatus } from "../../LoaderReducer/LoaderSlice";

// import Cookies from 'js-cookie'

type FormValues = {
  email:String
};
export const UForgotPassword = () => {
  const [cookie, setCookie, removeCookie] = useCookies(['token']);

  const navigate = useNavigate();
  const dispatch = useDispatch()
  const { register, handleSubmit,watch, formState: { errors }  } = useForm<FormValues>();
  const [showGreen, setShowGreen] = useState(false);
  const [showRed, setShowRed] = useState(false)
  const [alertValue, setAlertValue] = useState()
    const onSubmit: SubmitHandler<FormValues> = ((data) => {
    

        var body ={
          "email": data.email,
        
          "userType": "User"
        }
        // console.log("Sending body to verify data:",body)
        axios({
          
          method: 'post',
          
          url: '/forgotPasswordEmail',
          
          data:body, 
          headers: {
            'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
          }
        }).then(res=>{
          // console.log("usersignup respose:", res.data)
        
          if(res?.data?.response == true){
            setShowGreen(true)
            setAlertValue(res.data.message)
            sessionStorage.setItem("UTempEmail",JSON.stringify(data.email))
            // navigate('/user/enterVerificationCode')
          }
          else{
            setShowRed(true)
            setAlertValue(res.data.message)
          }
            
          
          
          // console.log(res.data)
          }).catch(err=>{console.log(err)})
        
      });
      useEffect(()=>{
        dispatch(LoaderStatus(false))
      },[])
  return (
    <>
     {showGreen?<>
      <Alert className="col-12 col-md-8 col-lg-6 p-1 d-flex align-items-center justify-content-between" show={showGreen} variant="success" style={{position:"sticky",top:"0px", height:"3rem"}}>
        <p style={{marginBottom:"0"}}>{alertValue}</p>
        <Button style={{fontSize:"80%"}} onClick={() => {
          setShowGreen(false)
          return navigate('/user/enterVerificationCode')
          }} variant="outline-success">
            Close
            </Button>
      </Alert>
    </>:<>
    <Alert className="col-12 col-md-8 col-lg-6 p-1 d-flex align-items-center justify-content-between" show={showRed} variant="danger" style={{position:"sticky",top:"0px", height:"3rem"}}>
        <p style={{marginBottom:"0"}}>{alertValue}</p>
        <Button style={{fontSize:"80%"}} onClick={() => setShowRed(false)} variant="outline-danger">
            Close
            </Button>
      </Alert></>
    
    }
    
    <div className="vh-80 d-flex justify-content-center align-items-center">
      <div className="container">
        <div className="row d-flex justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <div className="card bg-white">
              <div className="card-body  customResp">
                <form className="mb-3 mt-md-4" onSubmit={handleSubmit(onSubmit)}>
                  <h5 className="fw-bold mb-2 text-uppercase text-s">
                    Enter Your Email Address
                  </h5>

                  <div className="mb-3">
                    <p className="form-label text-start ">Email</p>
                    <input
                      type="email"
                      className="form-control"
                      {...register("email", {
                        required: true,
                       
                    })} 
                    />
                    {errors.email && <p style={{color:"red"}}>Field Required</p>}
                  </div>
                 
                  {/* <p className="small"><a className="text-primary" href="forget-password.html">Forgot password?</a></p> */}
                
                  <div className="d-grid">
                  
                  <button className="btn btn-outline-dark customBtnHover" type="submit">Submit</button>
                  </div>
                </form>
                <div>
                 
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>)
}
