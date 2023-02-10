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

// import Cookies from 'js-cookie'

type FormValues = {
  email:String
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

export const UChangePassword = () => {
  // const cookies = new Cookies();
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const [cookie, setCookie, removeCookie] = useCookies(['token']);
  const { register,watch, handleSubmit, formState: { errors } } = useForm<FormValues>();
  const [showGreen, setShowGreen] = useState(false);
  const [showRed, setShowRed] = useState(false)
  const [alertValue, setAlertValue] = useState()
  
 
  const onSubmit: SubmitHandler<FormValues> = ((data) => {
    
    var body ={
      "email": data.email,
      "oldPassword": data.oldPassword,
      "newPassword": data.newPassword,
      "confirmNewPassword": data.confirmNewPassword,
      "userType": "User"
    }
    // console.log(data)
    axios({
      
      method: 'post',
      
      url: '/changePassword',
      
      data:body, 
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      }
    }).then(res=>{
      
     
      if(res.data?.message === "Password Change Success"){
        setShowGreen(true)
        setAlertValue(res.data.message)
        // return navigate('/user/myUserProfile')
      }
      else{
        setShowRed(true)
        setAlertValue(res.data.message)
      }
      
      
      // console.log(res.data)
      }).catch(err=>{console.log(err)})
    
  });
//   // useEffect(()=>{console.log("fields",fields)},[fields])
//   useEffect(()=>{
//     // @ts-ignore
//     let token = cookie.token
//     if(token){
//      return navigate('/')
//     }
//   },[])
  return (
    <>
     {showGreen?<>
      <Alert className="col-12 col-md-8 col-lg-6 p-1" show={showGreen} variant="success" >
        <p>{alertValue || "check"}</p>
        <Button style={{fontSize:"80%"}} onClick={() => {
          setShowGreen(false)
          return navigate('/user/myUserProfile')
          }} variant="outline-success">
            Close
            </Button>
      </Alert>
    </>:<>
    <Alert className="col-12 col-md-8 col-lg-6 p-1" show={showRed} variant="danger" >
        <p>{alertValue || "not check"}</p>
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
              <div className="card-body p-5">
                <form className="mb-3 mt-md-4 " onSubmit={handleSubmit(onSubmit)}>
                  <h5 className="fw-bold mb-2 text-uppercase text-s">
                    Change your User account's password
                  </h5>
                  <div className="mb-3">
                    <p className="form-label text-start ">Confirm your Email address</p>
                    <input
                      type="email"
                      className="form-control"
                      {...register("email", {
                        required: true,
                        pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                    })} 
                    />
                    {errors.email && <p style={{color:"red"}}>Enter valid email</p>}
                  </div>
                  <div className="mb-3">
                    <p className="form-label text-start ">Old Password</p>
                    <input
                      type="password"
                      className="form-control"
                      {...register("oldPassword", {
                        required: true,
                        
                    })} 
                    />
                    {errors.oldPassword && <p style={{color:"red"}}>Field required</p>}
                  </div>
                  <div className="mb-3">
                    <p className="form-label text-start">New Password</p>
                    <input
                      type="password"
                      className="form-control"
                      {...register("newPassword",{
                        required: true,
                        pattern: /.{5,20}$/
                    })} 
                    />
                    {errors.newPassword && <p style={{color:"red"}}>New Password must be strong and minimum 5 CHaracters</p>}

                  </div>
                  <div className="mb-3">
                    <p className="form-label text-start">Confirm Password</p>
                    <input
                      type="password"
                      className="form-control"
                      {...register("confirmNewPassword",{required:true,
                        validate: (val: string) => {
                          if (watch('newPassword') != val) {
                            return "Your passwords do no match";
                          }}
                        })}
                    />
                    {errors.confirmNewPassword && <p style={{color:"red"}}>New Password and condirm New Password dont match</p>}
                  </div>
                  {/* <p className="small"><a className="text-primary" href="forget-password.html">Forgot password?</a></p> */}
                 
                  <div className="d-grid">
                  
                  <button className="btn btn-outline-dark" type="submit">Change Password</button>
                  </div>
                </form>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
 </> );
};
