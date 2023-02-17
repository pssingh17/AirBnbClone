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
};

export const ULogin = () => {
  // const cookies = new Cookies();
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const [cookie, setCookie, removeCookie] = useCookies(['token']);
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();
  
  const [showGreen, setShowGreen] = useState(false);
  const [showRed, setShowRed] = useState(false)
  const [alertValue, setAlertValue] = useState()
  const onSubmit: SubmitHandler<FormValues> = ((data) => {
    
    var body ={
      "email": data.email,
      "password": data.password,
      "userType": "User"
    }
    // console.log(data)
    axios({
      
      method: 'post',
      
      url: '/login',
    
      data:body, 
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      }
    }).then(res=>{
      
      let cookieCheck = cookie.token
      // console.log("Cookie check:",cookieCheck)
      if(!cookieCheck  && res.data.token){
      setShowGreen(true)
      setAlertValue(res.data.message)
        dispatch(userData(res.data))
      localStorage.setItem("User Data",JSON.stringify(res.data))
      if(res.data.favourites){

        localStorage.setItem("User Favourites",JSON.stringify(res.data.credentials.favourites))
      }
      localStorage.setItem("UserType",JSON.stringify(res.data.credentials.userType))
        setCookie("token",res.data.token,{path:'/'})
        // return navigate('/')
      }
      else{
        setShowRed(true)
        setAlertValue(res.data)
      }
      
      
      // console.log(res.data)
      }).catch(err=>{console.log(err)})
    
  });
  // useEffect(()=>{console.log("fields",fields)},[fields])
  useEffect(()=>{
    // @ts-ignore
    let token = cookie.token
    if(token){
     return navigate('/')
    }
   // @ts-ignore
   let AlertMessage = JSON.parse(localStorage.getItem("AlertMessageLogin"));
   if(AlertMessage){
     setAlertValue(AlertMessage)
     setShowRed(true)
   }
  },[])
  return (
    <>
    {showGreen?<>
      <Alert className="col-12 col-md-8 col-lg-6 p-1" show={showGreen} variant="success" >
        <p>{alertValue}</p>
        <Button style={{fontSize:"80%"}} onClick={() => 
          {setShowGreen(false)
          return navigate('/')}
          } variant="outline-success">
            Close
            </Button>
      </Alert>
    </>:<>
    <Alert className="col-12 col-md-8 col-lg-6 p-1" show={showRed} variant="danger" >
        <p>{alertValue}</p>
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
                <form className="mb-3 mt-md-4 " onSubmit={handleSubmit(onSubmit)}>
                  <h5 className="fw-bold mb-2 text-uppercase text-s">
                    Login into your User Account
                  </h5>

                  <div className="mb-3">
                    <p className="form-label text-start ">Email address</p>
                    <input
                      type="email"
                      className="form-control"
                      {...register("email", {
                        required: true,
                        pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                    })} 
                    />
                    {errors.email && <p style={{color:"red"}}>Enter Valid Email</p>}
                  </div>
                  <div className="mb-3">
                    <p className="form-label text-start">Password</p>
                    <input
                      type="password"
                      className="form-control"
                      {...register("password",{
                        required: true,
                        pattern: /.{5,20}$/
                    })} 
                    />
                    {errors.password && <p style={{color:"red"}}>Password must be strong and minimum 5 CHaracters</p>}

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
                  
                  <button className="btn btn-outline-dark" type="submit">Login</button>
                  </div>
                </form>
                <div>
                <p className="mb-0  text-center">
                   
                    <Link to="/user/forgotPassword" className="text-primary fw-bold">
                    Forgot Password?{" "}
                    </Link>
                  </p>
                  <p className="mb-0  text-center">
                    Don't have an account?{" "}
                    <Link to="/user/signUp" className="text-primary fw-bold">
                      Sign Up
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
</>  );
};
