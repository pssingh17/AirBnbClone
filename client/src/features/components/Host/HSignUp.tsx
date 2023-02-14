import React,{useEffect, useState} from "react";
import { Link } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { useDispatch } from 'react-redux'
import {userData} from "../../UserDataReducer/UserDataSlice";
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

// import Cookies from 'js-cookie'

type FormValues = {
 verificationCode:String
};

export const HSignUp = () => {
     // const cookies = new Cookies();
  const [cookie, setCookie, removeCookie] = useCookies(['token']);

  const navigate = useNavigate();
  const dispatch = useDispatch()
  const { register, handleSubmit , watch, formState: { errors }} = useForm<FormValues>();
  
 
  const onSubmit: SubmitHandler<FormValues> = ((data) => {
    let email = JSON.parse(sessionStorage.getItem("UTempEmail") || '{}')
    
    var body ={
        "email": email,
        "userType": "Host",
        "verificationCode": data.verificationCode,
    }
    
    // console.log("Sending body to verify data:",body)
    axios({
      
      method: 'post',
      
      url: '/signUp',
      
      data:body, 
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      }
    }).then(res=>{
        // console.log("usersignup respose:", res.data)
          if(res.data?.message==="Verified Successfully"){
            alert("Thank You for Verifying, You will be reidrected to home page")
            sessionStorage.clear();
          }
         
      
      
      // console.log("hostsignup respose:", res.data)

      let cookieCheck = cookie.token
      // console.log("Cookie check:",cookieCheck)
      if(!cookieCheck  && res.data.token){
        dispatch(userData(res.data))
      localStorage.setItem("User Data",JSON.stringify(res.data))
      localStorage.setItem("UserType",JSON.stringify(res.data.credentials.userType))

        setCookie("token",res.data.token,{path:'/'})
        return navigate('/')
      }
      else{
        alert(res.data)
      }
      // console.log(res.data)
      
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
    <div className="vh-80 d-flex justify-content-center align-items-center">
    <div className="container">
      <div className="row d-flex justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="card bg-white">
            <div className="card-body  customResp">
              <form className="mb-3 mt-md-4" onSubmit={handleSubmit(onSubmit)}>
                <h5 className="fw-bold mb-2 text-uppercase text-s">
                  Enter the verification Code
                </h5>

                <div className="mb-3">
                  <p className="form-label text-start ">Code</p>
                  <input
                    type="text"
                    className="form-control"
                    {...register("verificationCode", {
                      required: true,
                     
                  })} 
                  />
                  {errors.verificationCode && <p style={{color:"red"}}>Field Required</p>}
                </div>
               
                {/* <p className="small"><a className="text-primary" href="forget-password.html">Forgot password?</a></p> */}
              
                <div className="d-grid">
                
                <button className="btn btn-outline-dark" type="submit">Verify</button>
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
  )
}
