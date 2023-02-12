import React, { useEffect, useState } from 'react'
import {Link} from 'react-router-dom'
import { AdvanceFiltersModal } from '../AdvanceFiltersModal'

import type { RootState } from '../../../app/store'
import { useSelector } from 'react-redux'
import { Cookies } from 'react-cookie';
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { useDispatch } from 'react-redux'
import { useCookies } from 'react-cookie';
import { userData } from "../../UserDataReducer/UserDataSlice";
import { removeUserData } from '../../UserDataReducer/UserDataSlice'
import { useNavigate } from 'react-router-dom';
import { searchListingData } from '../../SearchListingReducer/SearchListingSlice'
import { LoaderStatus } from '../../LoaderReducer/LoaderSlice'



type SearchInput = {
  searchString:String
};
interface UserType{
  userType: String,
  login: Boolean
}


export const Navbar = () => {
  const [color,setColor] = useState(false)
  // const cookies = new Cookies();
  const { register, handleSubmit } = useForm<SearchInput>();
  const [userDataState, setUserDataState] = useState<String>()
  const [login,setLogin] = useState <UserType>()
  const [cookie, setCookie, removeCookie] = useCookies(['token']);
  const dispatch = useDispatch()
  const navigate = useNavigate();


  const onSubmit: SubmitHandler<SearchInput> = ((data) => {
    dispatch(LoaderStatus(true))
    var body ={
      "searchString": data.searchString,
    }
   
    // console.log(data)
    axios({
      
      method: 'post',
      
      url: '/api/search',
      
      data:body, 
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      }
    }).then(res=>{
    //  console.log("Search data", res.data)
     if(res.data){
      dispatch(searchListingData(res.data))
      dispatch(LoaderStatus(false))
      return navigate('/searchListing')
     }
     
  });})
  let lstorageUType;
  let userData : any = useSelector((state: RootState) => state.UserDataSlice.value)
  useEffect(()=>{
    let token = cookie.token
    // @ts-ignore
    lstorageUType = JSON.parse(localStorage.getItem("UserType"))
    if(token && lstorageUType){
      setLogin({login:true,userType:lstorageUType})
      // setUserDataState(lstorageUData)
    }
    else{
      setLogin({login:false,userType:""})
    }
  },[])
  useEffect(()=>{
    let token = cookie.token
   
     // @ts-ignore
     lstorageUType = JSON.parse(localStorage.getItem("UserType"))
     if(token && lstorageUType){
       setLogin({login:true,userType:lstorageUType})
       // setUserDataState(lstorageUData)
     }
     else{
       setLogin({login:false,userType:""})
     }
  },[userData])
  // console.log("User Data", userData)
  const logout = ()=>{
  
    // cookies.remove('token',{ path: '/' })
    removeCookie("token");
    // cookies.remove('token',{ path: '/host' })
    // cookies.remove('token',{ path: '/user' })
    setLogin({login:false,userType:""})
    dispatch(removeUserData([]))
    localStorage.clear();
    // console.log("Success logout")
    navigate('/')
  }
 
  return (
    
    <nav className="navbar navbar-dark navbar-expand-lg bg-dark" style={{paddingTop:"0.7rem", paddingBottom:"0.7rem"}}>
    <div className="container-fluid">
    <Link to="/" className='navbar-brand' data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show">Demo Site</Link>
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav nav-pills custom-color me-auto mb-2 mb-lg-0" id="pills-tab" role="tablist">
          <li className="nav-item " role="presentation">
            <button  className="nav-link px-2" aria-current="page" id="pills-home-tab" data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show" type="button" role="tab" aria-controls="pills-home" aria-selected="true" onClick={()=>{navigate('/')
            
          }}>Home</button>
             {/* data-bs-toggle="pill" data-bs-target="#pills-home" */}
          </li>
          <li className="nav-item " role="presentation">
            <button  className="nav-link px-2" aria-current="page" id="pills-trending-tab" data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show" type="button" role="tab" aria-controls="pills-trending" aria-selected="true" onClick={()=>{navigate('/trending')
           
          }}>Trending</button>
          </li>
          <li className="nav-item" role="presentation">
            <button  className="nav-link px-2" id="pill-topPicks-tab" data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show"type="button" role="tab" aria-controls="pills-topPicks" aria-selected="true" onClick={()=>{navigate('/topPicks')
           
          }}>Top Picks</button>
          </li>
          <li className="nav-item" role="presentation">
            <button className="nav-link px-2" id="pills-topRated-tab" 
            data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show" type="button" role="tab" aria-controls="pills-topRated" aria-selected="true" onClick={()=>{
              
              navigate('/topRated')}}>Top Rated</button>
          </li>
          {/* <li className="nav-item">
            <AdvanceFiltersModal />
          </li> */}
          <form className="d-flex" role="search" onSubmit={handleSubmit(onSubmit)}>
            
          <input className="form-control me-2" type="search" autoComplete="off" placeholder="Search" aria-label="Search"  id='searchField'  {...register("searchString")} />
          <button className="btn btn-dark btn-outline-primary px-3" data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show" type="submit">Search</button>
          
          
        </form>
        {userData?.token || login?.login ?
        
         userData?.credentials?.userType=="User" || login?.userType=="User"?
          <li className="nav-item dropdown " id='signInEnd'>
        <a className="nav-link px-2 dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
          Manage
        </a>
        <ul className="dropdown-menu dropdown-menu-end dropdown-menu-dark">
        <li><button onClick={()=>{navigate('/user/myUserProfile')}} data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show" className="dropdown-item" >My Profile</button></li>

        <li><hr className="dropdown-divider" /></li> 
        <li><button onClick={()=>{
          
          navigate('/user/bookings')} }className="dropdown-item" data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show"  >My Bookings</button></li>
          <li><hr className="dropdown-divider" /></li>
          <li><button onClick={()=>{
           
            navigate('/user/favourites')}} data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show" className="dropdown-item" >My Favourites</button></li>
          <li><hr className="dropdown-divider" /></li>
          
          <button className="btn btn-dark btn-outline-primary mx-2 px-3" data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show" onClick={logout}>Sign Out</button>
         
         
         
        </ul>
      </li>: <li className="nav-item dropdown " id='signInEnd'>
        <a className="nav-link px-2 dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
          Manage
        </a>
        <ul className="dropdown-menu dropdown-menu-end dropdown-menu-dark">
        <li><button data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show" onClick={()=>navigate('/host/myHostProfile')} className="dropdown-item" >My Profile</button></li>
        <li><hr className="dropdown-divider" /></li> 
        <li><button onClick={()=>{
          
          navigate('/host/MyListing')} }className="dropdown-item" data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show">My Listing</button></li>
          <li><hr className="dropdown-divider" /></li>    
          <button className="btn btn-dark btn-outline-primary mx-2" data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show" onClick={logout}>Sign Out</button> 
        </ul>
      </li>
         
         
       
      :
        <li className="nav-item dropdown " id='signInEnd'>
        <a className="nav-link px-2 dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
          Sign In
        </a>
        <ul className="dropdown-menu dropdown-menu-end dropdown-menu-dark">
          <li><button data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show" onClick={()=>navigate('/user/login')} className="dropdown-item" >Sign In as User</button ></li>
          <li><hr className="dropdown-divider" /></li>
          <li><button onClick={()=>navigate('/host/login')} data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show" className="dropdown-item" >Host an experience</button></li>
         
         
        </ul>
      </li>
        }
          
        
        </ul>
        <div className="tab-content" id="pills-tabContent">
  <div className="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">...</div>
  <div className="tab-pane fade" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab">...</div>
  <div className="tab-pane fade" id="pills-contact" role="tabpanel" aria-labelledby="pills-contact-tab">...</div>
</div>
        
      </div>
    </div>
  </nav>
  )
}
