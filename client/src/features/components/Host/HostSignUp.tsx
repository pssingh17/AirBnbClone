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
  email: string;
  password: string;
  confirmPassword: string
};

export const HostSignUp = () => {
  // const cookies = new Cookies();
  const [cookie, setCookie, removeCookie] = useCookies(['token']);

  const navigate = useNavigate();
  const dispatch = useDispatch()
  const { register, handleSubmit , watch, formState: { errors }} = useForm<FormValues>();
  const [showGreen, setShowGreen] = useState(false);
  const [showRed, setShowRed] = useState(false)
  const [alertValue, setAlertValue] = useState()
  
 
  const onSubmit: SubmitHandler<FormValues> = ((data) => {
    
    var body ={
      "email": data.email,
      "password": data.password,
      "confirmPassword": data.confirmPassword,
      "host":{"host_id":Date.now()},
      "userType": "Host"
    }
    
    // console.log(data)
    axios({
      
      method: 'post',
      
      url: '/verifyEmail',
      
      data:body, 
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      }
    }).then(res=>{
      
     
      // console.log("hostverifyemail respose:", res.data)
      if(res.data =="Verify Your Email"){
        setShowGreen(true)
        setAlertValue(res.data)
        // console.log(res.data)
        sessionStorage.setItem("UTempEmail",JSON.stringify(data.email))
        // navigate('/host/verifyEmail')
      }
      else{
        setShowRed(true)
        setAlertValue(res.data)
      }
     
      
    }
      ).catch(err=>{console.log(err)})
    
  });
  // useEffect(()=>{console.log("fields",fields)},[fields])
  useEffect(()=>{
    // @ts-ignore
    let token = cookie.token
    if(token && token!=undefined){
     return navigate('/')
    }
  },[])
  return (
    <>
     {showGreen?<>
      <Alert className="col-12 col-md-8 col-lg-6 p-1 d-flex align-items-center justify-content-between" show={showGreen} variant="success" >
        <p style={{marginBottom:"0"}}>{alertValue}</p>
        <Button style={{fontSize:"80%"}} onClick={() => 
          {setShowGreen(false)
          return navigate('/host/verifyEmail')}
          } variant="outline-success">
            Close
            </Button>
      </Alert>
    </>:<>
    <Alert className="col-12 col-md-8 col-lg-6 p-1 d-flex align-items-center justify-content-between" show={showRed} variant="danger" >
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
                    SignUp for Listing Account
                  </h5>

                  <div className="mb-3">
                    <p className="form-label text-start ">Email address</p>
                    <input
                      type="email"
                      className="form-control"
                      {...register("email",{
                        required: true,
                        pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                    })}
                    />
                     {errors.email && <p style={{color:"red"}}>Enter valid email</p>}
                  </div>
                  <div className="mb-3">
                    <p className="form-label text-start">Password</p>
                    <input
                      type="password"
                      className="form-control"
                      {...register("password",{
                        required: true,
                        pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/
                    })} 
                    
                    />
                    {errors.password && <p style={{color:"red"}}>Password must be strong and minimum 6 CHaracters</p>}
                  </div>
                  <div className="mb-3">
                    <p className="form-label text-start">Confirm Password</p>
                    <input
                      type="password"
                      className="form-control"
                      {...register("confirmPassword",{required:true,
                      validate: (val: string) => {
                        if (watch('password') != val) {
                          return "Your passwords do no match";
                        }}
                      })}
                    />
                    {errors.confirmPassword && <p style={{color:"red"}}>Passwords dont match</p>}
                  </div>
                  {/* <p className="small"><a className="text-primary" href="forget-password.html">Forgot password?</a></p> */}
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="gridCheck" required
                    /> 
                    <p className="form-check-label text-start">Remember Me</p>
                  </div>
                  <div className="d-grid">
                  
                  <button className="btn btn-outline-dark customBtnHover" type="submit">Sign Up</button>
                  </div>
                </form>
                <div>
                  <p className="mb-0  text-center">
                    Already have an account?{" "}
                    <Link to="/host/login" className="text-primary fw-bold">
                      Login
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
 </> );
};
