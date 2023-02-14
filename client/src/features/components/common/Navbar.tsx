import React, { useEffect, useState } from 'react'
import {Link, NavLink} from 'react-router-dom'
import { AdvanceFiltersModal } from '../AdvanceFiltersModal'
import { Container, Navbar, Nav, NavDropdown } from "react-bootstrap";
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


export const CNavbar = () => {
  const [color,setColor] = useState(false)
  const [expanded, setExpanded] = useState(false);
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
  let activeStyle = {
    color:"aqua",
    backgroundColor:"rgb(50 48 48)",
    borderRadius:"13px",
    fontWeight:"600"
  };

  let activeClassName = "customColor";
 
  return (
    <>
   
    <Navbar expanded={expanded} bg="light" variant='light' expand="lg" style={{paddingTop:"0.7rem", paddingBottom:"0.7rem",borderBottom:"1px solid #979797"}}>
    <Container fluid>
    <NavLink style={{textDecoration:"none"}}
              to="/"><Navbar.Brand>Demo Site</Navbar.Brand>
    </NavLink>
        <Navbar.Toggle
          aria-controls="navbarScroll"
          onClick={() => setExpanded(!expanded)}
        />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="me-auto my-2 my-lg-0" style={{alignItems:"flex-start"}} navbarScroll>
            <NavLink
              to="/"
              className="nav-link px-2"
              onClick={() => setExpanded(false)}
              style={({ isActive }) =>
              isActive ? activeStyle : undefined
            } 
            >
              Home
            </NavLink>
            <NavLink
              to="/trending"
              className="nav-link px-2"
              onClick={() => setExpanded(false)}
              style={({ isActive }) =>
              isActive ? activeStyle : undefined
            }
            >
              Trending
            </NavLink>
            <NavLink
              to="topPicks"
              className="nav-link px-2"
              onClick={() => setExpanded(false)}
              style={({ isActive }) =>
              isActive ? activeStyle : undefined
            }
            >
              TopPicks
            </NavLink>
            <NavLink
              to="topRated"
              className="nav-link px-2"
              onClick={() => setExpanded(false)}
              style={({ isActive }) =>
              isActive ? activeStyle : undefined
            }
            >
              TopRated
            </NavLink>
            <form className="d-flex" role="search" onSubmit={handleSubmit(onSubmit)}>
            
            <input className="form-control me-2" type="search" autoComplete="off" placeholder="Search" aria-label="Search"  id='searchField'  {...register("searchString")} />
            <button className="btn btn-dark btn-outline-primary px-3" data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show" type="submit">Search</button>
            
            
          </form>
              
        {userData?.token || login?.login ?
        
         userData?.credentials?.userType=="User" || login?.userType=="User"?
         <>
         <NavDropdown className='customDrop' align="end" title="Manage" id="basic-nav-dropdown">
          <NavDropdown.Item href="#action/3.1" onClick={()=>{
            setExpanded(false)
            navigate('/user/myUserProfile')}} >My Profile</NavDropdown.Item>
          <NavDropdown.Item href="#action/3.2" onClick={()=>{
            setExpanded(false)
          dispatch(LoaderStatus(true)) 
          navigate('/user/bookings')} }>My Bookings</NavDropdown.Item>
          <NavDropdown.Item href="#action/3.3" onClick={()=>{
            setExpanded(false)
            dispatch(LoaderStatus(true))
            navigate('/user/favourites')}}>My Favourites</NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item href="#action/3.4" onClick={()=>{
            setExpanded(false)
            logout()}}>Sign Out</NavDropdown.Item>
        </NavDropdown>
         </>: 
         <>
          <NavDropdown  className='customDrop 'align="end"  title="Manage" id="basic-nav-dropdown">
          <NavDropdown.Item href="#action/3.1" onClick={()=>{
            setExpanded(false)
            navigate('/host/myHostProfile')} } >My Profile</NavDropdown.Item>
          <NavDropdown.Item href="#action/3.2" onClick={()=>{
            setExpanded(false)
          dispatch(LoaderStatus(true))
          navigate('/host/MyListing')} }>My Listings</NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item href="#action/3.4" onClick={()=>{
            setExpanded(false)
            logout()}}>Sign Out</NavDropdown.Item>
        </NavDropdown>
        
         </>
         
       
      :
      <>
       <NavDropdown  className='customDrop ' align="end" title="SignIn" id="basic-nav-dropdown">
          <NavDropdown.Item href="#action/3.1" onClick={()=>{
            setExpanded(false)
            navigate('/user/login')} }>Sign In As User</NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item href="#action/3.2" onClick={()=>{
            setExpanded(false)
            navigate('/host/login')} }>Host An Experience</NavDropdown.Item>
         
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
