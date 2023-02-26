
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Cookies } from 'react-cookie'
import { useDispatch,useSelector } from 'react-redux'
import { RootState } from '../../../app/store'
import ListingCard from '../ListingCard'
import { FavouritesData } from '../../FavouritesReducer/FavouritesSlice'
import { Link, useNavigate } from 'react-router-dom'
import { LoaderStatus } from '../../LoaderReducer/LoaderSlice'
import FavImg from '../../../images/fav.jpeg'
import BookImg from '../../../images/booking.jpeg'
import CPImg from '../../../images/cp.jpeg'
import axiosRetry from 'axios-retry'


export const MyUserProfile = () => {
  let cookies = new Cookies()
  let dispatch = useDispatch()
  let navigate = useNavigate()
  const [userDataState,setUserDataState] = useState<String[]>([])
  
  const MyFavouritesRedux:any = useSelector((state: RootState) => state.FavouritesSlice.value)
  // console.log("My fav redux in profile:", MyFavouritesRedux)
  axiosRetry(axios, {
    retries: 5, // number of retries
    retryDelay: (retryCount) => {
        console.log(`retry attempt: ${retryCount}`);
        return retryCount * 2000; // time interval between retries
    },
    // @ts-ignore
    retryCondition: (error) => {
        // if retry condition is not specified, by default idempotent requests are retried
        // @ts-ignore
        return error;
    },
});
  useEffect(()=>{
    let token = cookies.get('token')
     // @ts-ignore
    let lstorageUType = JSON.parse(localStorage.getItem("UserType"))
     if(token != undefined && lstorageUType==="User"){
    dispatch(LoaderStatus(true))
    axios({
      method:'post',
      url: '/user/MyUserProfile',
      headers: {
        Authorization: `Bearer ${token}`,
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      }
    }).then(res=>{
      // console.log("rrsponse from Uprofile",res.data)
      dispatch(LoaderStatus(false))
      setUserDataState(res.data)
      dispatch(FavouritesData(res.data.newData))
    }).catch(err=>{
      console.log("Error-",err)
      if (err?.response?.data?.loggedIn === false){
    dispatch(LoaderStatus(false))

        console.log("Token expired.Please Verify- ", err?.response?.data.message)
        cookies.remove("token")
        localStorage.clear()
        localStorage.setItem("AlertMessageLogin", JSON.stringify("Please verify your identity again"))
        navigate('/user/login')
      }
    })
  }
  
    else{
      navigate('/user/login')
      dispatch(LoaderStatus(false))
    }
  
  },[])
 
  
  return (
    <>
 
 
    {MyFavouritesRedux?
    <>
    
    <h2 className=" text-danger">
            <i>Welcome {MyFavouritesRedux?.email}</i>
          </h2>
          <div className="text-start">
            <h5 className="text-center">Shortcuts for your data</h5>
            <div className="d-flex justify-content-around mt-4 flex-wrap">
              <Link to="/user/favourites">
            <div className="card m-2 customHover" style={{ width: "19rem" }}>
              <img className="card-img-top" src="https://res.cloudinary.com/dpbhb8hqb/image/upload/v1676811908/fav_eozffw.jpg" alt="My Favourites" />
            
             
            
            </div>
            </Link>
            <Link to="/user/bookings">
            <div className="card m-2 customHover" style={{ width: "19rem" }}>
              <img className="card-img-top" src="https://res.cloudinary.com/dpbhb8hqb/image/upload/v1676811908/booking_echwtr.jpg" alt="My Bookings" />
             
            
            </div>
            </Link>
            <Link to="/user/changePassword">
            <div className="card m-2 customHover" style={{ width: "19rem" }}>
              <img className="card-img-top" src="https://res.cloudinary.com/dpbhb8hqb/image/upload/v1676811908/cp_pgd3yw.jpg" alt="Change Password" />
             
            
            </div>
            </Link>
            </div>
          </div>
        
     
       
    
      
        
        
</>
    
    :
    "You are either logged out or some error occured, try again later"}
    
    </>
  )

}
