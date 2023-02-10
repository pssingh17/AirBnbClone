import React from 'react'
import { useForm, SubmitHandler } from "react-hook-form";
import { useCookies } from 'react-cookie';
import { useDispatch } from 'react-redux'
import axios from 'axios';
import { userData } from '../../UserDataReducer/UserDataSlice';
import { useNavigate } from 'react-router-dom';

type FormValues = {
    email: string;
    password: string;
    confirmPassword: string
  };

export const CreateNewListingPage = () => {
  const [cookie, setCookie, removeCookie] = useCookies(['token']);
  const dispatch = useDispatch()
    const navigate = useNavigate()
  const { register, handleSubmit } = useForm<FormValues>();
  const onSubmit: SubmitHandler<FormValues> = ((data) => {
    
    var body ={
      "email": data.email,
      "password": data.password,
      "confirmPassword": data.confirmPassword,
      "userType": "Host"
    }
    console.log(data)
    axios({
      
      method: 'post',
      
      url: '/signUp',
      
      data:body, 
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      }
    }).then(res=>{
      
      // if(res.data.favourites){

      //   localStorage.setItem("User Favourites",JSON.stringify(res.data.credentials.favourites))
      // }
      console.log("hostsignup respose:", res.data)

      let cookieCheck = cookie.token
      console.log("Cookie check:",cookieCheck)
      if(!cookieCheck  && res.data.token){
        dispatch(userData(res.data))
      localStorage.setItem("User Data",JSON.stringify(res.data))
      localStorage.setItem("UserType",JSON.stringify(res.data.credentials.userType))

        setCookie("token",res.data.token,{path:'/'})
        return navigate('/host/MyListing')
      }
      else{
        alert(res.data)
      }
      console.log(res.data)
      
    }
      ).catch(err=>{console.log(err)})
    
  });

    return (
        <div className="vh-80 d-flex justify-content-center align-items-center">
          <div className="container">
            <div className="row d-flex justify-content-center">
              <div className="col-12 col-md-8 col-lg-6">
                <div className="card bg-white">
                  <div className="card-body p-5">
                    <form className="mb-3 mt-md-4" onSubmit={handleSubmit(onSubmit)}>
                      <h5 className="fw-bold mb-2 text-uppercase text-s">
                        SignUp for Listing Account
                      </h5>
    
                      <div className="mb-3">
                        <p className="form-label text-start ">Email address</p>
                        <input
                          type="email"
                          className="form-control"
                          {...register("email")}
                        />
                      </div>
                      <div className="mb-3">
                        <p className="form-label text-start">Password</p>
                        <input
                          type="password"
                          className="form-control"
                          {...register("password")}
                        />
                      </div>
                      <div className="mb-3">
                        <p className="form-label text-start">Confirm Password</p>
                        <input
                          type="password"
                          className="form-control"
                          {...register("confirmPassword")}
                        />
                      </div>
                      {/* <p className="small"><a className="text-primary" href="forget-password.html">Forgot password?</a></p> */}
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="gridCheck"
                        />
                        <p className="form-check-label text-start">Remember Me</p>
                      </div>
                      <div className="d-grid">
                      
                      <button className="btn btn-outline-dark" type="submit">Sign Up</button>
                      </div>
                    </form>
                    <div>
                      <p className="mb-0  text-center">
                        Already have an account?{" "}
                       
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
}
