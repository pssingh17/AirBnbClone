import React, { useEffect, useState } from 'react'
import {Link, NavLink} from 'react-router-dom'
import { AdvanceFiltersModal } from '../AdvanceFiltersModal'
import { Container, Navbar, Nav, NavDropdown } from "react-bootstrap";
import type { RootState } from '../../../app/store'
import { useSelector } from 'react-redux'
import { Cookies } from 'react-cookie';
import axios from "axios";
import { useDispatch } from 'react-redux'
import { useCookies } from 'react-cookie';
import { userData } from "../../UserDataReducer/UserDataSlice";
import { removeUserData } from '../../UserDataReducer/UserDataSlice'
import { useNavigate } from 'react-router-dom';

import { LoaderStatus } from '../../LoaderReducer/LoaderSlice'




interface UserType{
  userType: String,
  login: Boolean,
  userEmail: String
}


export const CNavbar = () => {
  const [color,setColor] = useState(false)
  const [expanded, setExpanded] = useState(false);
  const cookies = new Cookies();
  const [userDataState, setUserDataState] = useState<String>()
  const [login,setLogin] = useState <UserType>()
  const [cookie, setCookie, removeCookie] = useCookies(['token']);
  const dispatch = useDispatch()
  const navigate = useNavigate();

  let userData : any = useSelector((state: RootState) => state.UserDataSlice.value)

 
  let lstorageUType, lstorageUEmail;


  useEffect(()=>{
    let token = cookie.token
    // @ts-ignore
    lstorageUType = JSON.parse(localStorage.getItem("UserType"))
    // @ts-ignore
    lstorageUEmail = JSON.parse(localStorage.getItem("User Date"))

    if(token && lstorageUType){
      setLogin({login:true,userType:lstorageUType, userEmail: lstorageUEmail?.credentials?.email})
      // setUserDataState(lstorageUData)
    }
    else{
      setLogin({login:false,userType:"", userEmail:""})
    }
  },[])
  useEffect(()=>{
    let token = cookie.token
   
     // @ts-ignore
     lstorageUType = JSON.parse(localStorage.getItem("UserType"))
      // @ts-ignore
    lstorageUEmail = JSON.parse(localStorage.getItem("User Data"))
  
     if(token && lstorageUType){
       setLogin({login:true,userType:lstorageUType, userEmail: lstorageUEmail?.credentials?.email})
       // setUserDataState(lstorageUData)
     }
     else{
       setLogin({login:false,userType:"", userEmail:""})
     }
  },[userData])
  // console.log("User Data", userData)
  const logout = ()=>{
  
    cookies.remove('token',{ path: '/' })
    removeCookie("token");
   
    setLogin({login:false,userType:"", userEmail:""})
    dispatch(removeUserData([]))
    localStorage.clear();
    // console.log("Success logout")
    navigate('/')
  }
  let activeStyle = {
    color:"",
    // backgroundColor:"grey",
    // borderRadius:"13px",
    
    fontWeight:"700"
  };

  let activeClassName = "customColor";

  return (
    <>
   
    <Navbar expanded={expanded} bg="light" variant='light' style={{paddingTop:"0.5rem", paddingBottom:"0.5rem",borderBottom:"1px solid #979797"}}>
    <Container fluid>
   
        <Navbar.Toggle
          aria-controls="navbarScroll"
          onClick={() => setExpanded(!expanded)}
        />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="me-auto my-2 my-lg-0" style={{alignItems:"flex-start"}} navbarScroll>
            <NavLink
              to="/"
              className="nav-link"
              onClick={() => {
                localStorage.removeItem("SearchString")
                setExpanded(false)}}
              style={({ isActive }) =>
              isActive ? activeStyle : undefined
            } 
            >
              Home
            </NavLink>
            <NavLink
              to="/trending"
              className="nav-link"
              onClick={() => {
                localStorage.removeItem("SearchString")
                setExpanded(false)}}
              style={({ isActive }) =>
              isActive ? activeStyle : undefined
            }
            >
              Popular
            </NavLink>
            <NavLink
              to="topPicks"
              className="nav-link"
              onClick={() => {
                localStorage.removeItem("SearchString")
                setExpanded(false)}}
              style={({ isActive }) =>
              isActive ? activeStyle : undefined
            }
            >
              TopPicks
            </NavLink>
            <NavLink
              to="topRated"
              className="nav-link"
              onClick={() =>{
                localStorage.removeItem("SearchString")
                setExpanded(false)}}
              style={({ isActive }) =>
              isActive ? activeStyle : undefined
            }
            >
              TopRated
            </NavLink>
           
              
        {userData?.token || login?.login ?
        
         userData?.credentials?.userType=="User" || login?.userType=="User"?
         <>
         <NavDropdown className='customDrop' align="end" title={
          <>
          <div className='customNavbarUser'>{login?.userEmail.slice(0,login.userEmail.indexOf('@')) || userData?.credentials?.email.slice(0,userData?.credentials?.email.indexOf('@'))} </div>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-three-dots-vertical svgInDropdown" viewBox="0 0 16 16">
          <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
        </svg></>
         } id="basic-nav-dropdown" renderMenuOnMount={true}>
          <NavDropdown.Item href="" onClick={()=>{
            setExpanded(false)
            navigate('/user/myUserProfile')}} style={{borderTopLeftRadius:"13px", borderTopRightRadius:"13px", padding:"0.65rem"}}><div className='myProfile'>My Profile</div>
            <div className='userName'>{login?.userEmail.slice(0,login.userEmail.indexOf('@')) || userData?.credentials?.email.slice(0,userData?.credentials?.email.indexOf('@'))} </div>
            </NavDropdown.Item>
          <NavDropdown.Item href="" onClick={()=>{
            setExpanded(false)
           
          navigate('/user/bookings')} } style={{padding:"0.65rem"}}>My Bookings</NavDropdown.Item>
          <NavDropdown.Item href="" onClick={()=>{
            setExpanded(false)
            
            navigate('/user/favourites')}} style={{padding:"0.65rem"}}>My Favourites</NavDropdown.Item>
          
          <NavDropdown.Item href="" onClick={()=>{
            setExpanded(false)
            logout()}} style={{borderBottomLeftRadius:"13px", borderBottomRightRadius:"13px",padding:"0.65rem"}}>Sign Out</NavDropdown.Item>
        </NavDropdown>
         </>: 
         <>
          <NavDropdown  className='customDrop 'align="end"  title={
          <>
          <div className='customNavbarUser'>{login?.userEmail.slice(0,login.userEmail.indexOf('@')) || userData?.credentials?.email.slice(0,userData?.credentials?.email.indexOf('@'))} </div>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-three-dots-vertical svgInDropdown" viewBox="0 0 16 16">
          <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
        </svg></>
         }id="basic-nav-dropdown" renderMenuOnMount={true}>
          <NavDropdown.Item href="" onClick={()=>{
            setExpanded(false)
            navigate('/host/myHostProfile')} } style={{borderTopLeftRadius:"13px", borderTopRightRadius:"13px",padding:"0.65rem"}}><div className='myProfile'>My Profile</div>
            <div className='userName'>{login?.userEmail.slice(0,login.userEmail.indexOf('@')) || userData?.credentials?.email.slice(0,userData?.credentials?.email.indexOf('@'))} </div></NavDropdown.Item>
          <NavDropdown.Item href="" onClick={()=>{
            setExpanded(false)
        
          navigate('/host/MyListing')} } style={{padding:"0.65rem"}}>My Listings</NavDropdown.Item>
          
          <NavDropdown.Item href="" onClick={()=>{
            setExpanded(false)
            logout()}} style={{borderBottomLeftRadius:"13px", borderBottomRightRadius:"13px",padding:"0.65rem"}}>Sign Out</NavDropdown.Item>
        </NavDropdown>
        
         </>
         
       
      :
      <>
       <NavDropdown  className='customDrop ' align="end" title={<>
       <div className='customNavbarUser'>SignIn</div>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-three-dots-vertical svgInDropdown" viewBox="0 0 16 16">
          <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
        </svg>
       </>} id="basic-nav-dropdown" renderMenuOnMount={true}>
          <NavDropdown.Item href="" onClick={()=>{
            setExpanded(false)
            navigate('/user/login')} } style={{borderTopLeftRadius:"13px", borderTopRightRadius:"13px",padding:"0.65rem"}}>Sign In As User</NavDropdown.Item>
          
          <NavDropdown.Item href="" onClick={()=>{
            setExpanded(false)
            navigate('/host/login')} } style={{borderBottomLeftRadius:"13px", borderBottomRightRadius:"13px",padding:"0.65rem"}}>Host An Experience</NavDropdown.Item>
         
        </NavDropdown>
       
      </>
        }
          
        
        
      
      
    
      </Nav>
        </Navbar.Collapse> 
    </Container>
    </Navbar>
  

  </>
  )
}
