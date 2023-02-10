
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import { useDispatch,useSelector } from 'react-redux'
import { RootState } from '../../../app/store'
import ListingCard from '../ListingCard'
import { FavouritesData } from '../../FavouritesReducer/FavouritesSlice'
import { userData, UserDataSlice } from '../../UserDataReducer/UserDataSlice'
import { Link, useNavigate } from 'react-router-dom'

export const MyHostProfile = () => {
  // let cookies = new Cookies()
  const [cookie, setCookie, removeCookie] = useCookies(['token']);

  let dispatch = useDispatch()
  let navigate = useNavigate()
  const [userDataState,setUserDataState] = useState<String[]>([])
  
  const UserDataRedux:any = useSelector((state: RootState) => state.UserDataSlice.value)
  // console.log("My fav redux in profile:", MyFavouritesRedux)

  useEffect(()=>{
    let token = cookie.token
    axios({
      method:'post',
      url: '/host/MyHostProfile',
      headers: {
        Authorization: `Bearer ${token}`,
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      }
    }).then(res=>{
      console.log("rrsponse from myHostProfile",res.data)

      localStorage.setItem("User Data",JSON.stringify(res.data))
      localStorage.setItem("User Listings",JSON.stringify(res.data.credentials))
      if(res.data.credentials.userType){

        localStorage.setItem("UserType",JSON.stringify(res.data.credentials.userType))
      }
      setUserDataState(res.data)
      dispatch(userData(res.data))
    })
  },[])
 
  
  return (
    <>
 
 
    {UserDataRedux?
   <>
   
    
   <h1 className=' text-primary'><i>Welcome {UserDataRedux?.credentials?.email}</i></h1>
   <div className='text-start'>
   <h5 className='text-start'>Shortcuts for your data</h5>
   <Link to="/host/MyListing" className="btn btn-dark mt-auto m-1 px-3" >My Listing</Link>

   </div>
   
   <div className='text-start mt-5'>
     <h5>Want to change your account's password???</h5>
     <button className='btn btn-dark w-auto m-1 px-3' onClick={()=>{navigate("/host/changePassword")}}>Change Here</button>
   </div>
  

 
   
   
</>

:
"You are either logged out or some error occured, try again later"}

</>
)

}
