
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import { useDispatch,useSelector } from 'react-redux'
import { RootState } from '../../../app/store'
import ListingCard from '../ListingCard'
import { FavouritesData } from '../../FavouritesReducer/FavouritesSlice'
import { userData, UserDataSlice } from '../../UserDataReducer/UserDataSlice'
import { Link, useNavigate } from 'react-router-dom'
import { LoaderStatus } from '../../LoaderReducer/LoaderSlice'
import MyListingImg from '../../../images/myListing.jpeg'
import CPImg from '../../../images/cp.jpeg'



export const MyHostProfile = () => {
  // let cookies = new Cookies()
  const [cookie, setCookie, removeCookie] = useCookies(['token']);

  let dispatch = useDispatch()
  let navigate = useNavigate()
  const [userDataState,setUserDataState] = useState<String[]>([])
  
  const UserDataRedux:any = useSelector((state: RootState) => state.UserDataSlice.value)
  // console.log("My fav redux in profile:", MyFavouritesRedux)

  useEffect(()=>{
    dispatch(LoaderStatus(true))
    let token = cookie.token
    axios({
      method:'post',
      url: '/host/MyHostProfile',
      headers: {
        Authorization: `Bearer ${token}`,
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      }
    }).then(res=>{
      // console.log("rrsponse from myHostProfile",res.data)
      dispatch(LoaderStatus(false))
      localStorage.setItem("User Data",JSON.stringify(res.data))
      localStorage.setItem("User Listings",JSON.stringify(res.data.credentials))
      if(res.data.credentials.userType){

        localStorage.setItem("UserType",JSON.stringify(res.data.credentials.userType))
      }
      setUserDataState(res.data)
      dispatch(userData(res.data))
    }).catch(err=>{
      console.log("Error-",err)
      if (err?.response?.data?.loggedIn === false){
    dispatch(LoaderStatus(true))
        console.log("Token expired.Please Verify- ", err?.response?.data.message)
        removeCookie("token")
        localStorage.clear()
        localStorage.setItem("AlertMessageLogin", JSON.stringify("Please verify your identity again"))
        navigate('/host/login')
      }
    })
  },[])
 
  
  return (
    <>
 
 
    {UserDataRedux?
   <>
   
    
   <h2 className=" text-danger">
            <i>Welcome {UserDataRedux?.credentials?.email}</i>
          </h2>
          <div className="text-start">
            <h5 className="text-center">Shortcuts for your data</h5>
            <div className="d-flex justify-content-around mt-4 flex-wrap">
              <Link to="/host/myListing">
            <div className="card m-2 customHover" style={{ width: "19rem" }}>
              <img className="card-img-top" src={MyListingImg} alt="Card image cap" />
            
             
            
            </div>
            </Link>
            <Link to="/host/changePassword">
            <div className="card m-2 customHover" style={{ width: "19rem" }}>
              <img className="card-img-top" src={CPImg} alt="Card image cap" />
             
            
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
