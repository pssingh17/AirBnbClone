import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import { useDispatch,useSelector } from 'react-redux'
import { RootState } from '../../../app/store'
import ListingCard from '../ListingCard'
import { FavouritesData } from '../../FavouritesReducer/FavouritesSlice'
import { Link, useNavigate } from 'react-router-dom'
import { userData } from '../../UserDataReducer/UserDataSlice'
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import { LoaderStatus } from '../../LoaderReducer/LoaderSlice'
import axiosRetry from 'axios-retry'



export const MyListing = () => {
  const [cookie, setCookie, removeCookie] = useCookies(['token']);
  const navigate = useNavigate()
  let dispatch = useDispatch()
  const isLoading = useSelector((state:RootState)=>state.LoaderSlice.value)

  const [listingExist,setListingExist] = useState(false)
  const [showGreen, setShowGreen] = useState(false);
  const [showRed, setShowRed] = useState(false)
  const [alertValue, setAlertValue] = useState()
  const [errorImage, setErrorImage] = useState(
    "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  );
   // @ts-ignore
   const replaceImage = (error) => {
    //replacement of broken Image
    error.target.src = errorImage;
  };
  
  // @ts-ignore
  const UserDataRedux = useSelector((state: RootState) => state.UserDataSlice.value.credentials)
  
  // console.log("My fav redux in profile:", MyFavouritesRedux)

  
  const DeleteListing= ()=>{
    let token = cookie.token
    axios({
      method:'post',
      url: '/host/deleteHostListing',
      headers: {
        Authorization: `Bearer ${token}`,
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      }
    }).then(res=>{
      // console.log("rrsponse from myHostProfile",res.data)
      let name1=undefined ?? res.data.credentials.name
      if( name1 === undefined){

        setListingExist(false)
        setShowGreen(true)
        setAlertValue(res.data.message)
      }
      else{
        setListingExist(true)
      }
      dispatch(userData(res.data))
    }).catch(err=>{
      console.log("Error-",err)
      if (err?.response?.data?.loggedIn === false){
        console.log("Token expired.Please Verify- ", err?.response?.data.message)
        removeCookie("token")
        localStorage.clear()
        localStorage.setItem("AlertMessageLogin", JSON.stringify("Please verify your identity again"))
        navigate('/host/login')
      }
    })

  }
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
    let token = cookie.token
     // @ts-ignore
     let lstorageUType = JSON.parse(localStorage.getItem("UserType"))
    // console.log("token", token)
    if(token != undefined && lstorageUType==="Host"){
      dispatch(LoaderStatus(true))
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
        dispatch(userData(res.data))

        let name1= res.data.credentials.name
        if(name1){
  
          setListingExist(true)
        }
        else{
          setListingExist(false)
        }
      }).catch(err=>{
        console.log("Error-",err)
        if (err?.response?.data?.loggedIn === false){
          dispatch(LoaderStatus(false))
          console.log("Token expired.Please Verify- ", err?.response?.data.message)
          removeCookie("token")
          localStorage.clear()
          localStorage.setItem("AlertMessageLogin", JSON.stringify("Please verify your identity again"))
          navigate('/host/login')
        }
      })
    }
    else{
      navigate('/host/login')
      dispatch(LoaderStatus(false))
    }

  },[])
 
  
  return (
    <>
  {showGreen?<>
      <Alert className="col-12 col-md-8 col-lg-6 p-1" show={showGreen} variant="success" style={{position:"sticky",top:"0px", height:"3rem"}}>
        <p>{alertValue}</p>
        <Button style={{fontSize:"80%"}} onClick={() => 
          {setShowGreen(false)
          }
          } variant="outline-success">
            Close
            </Button>
      </Alert>
    </>:<>
    <Alert className="col-12 col-md-8 col-lg-6 p-1" show={showRed} variant="danger" style={{position:"sticky",top:"0px", height:"3rem"}}>
        <p>{alertValue}</p>
        <Button style={{fontSize:"80%"}} onClick={() => setShowRed(false)} variant="outline-danger">
            Close
            </Button>
      </Alert></>
    
    }
  
    {listingExist?
    <>
<div className='listing-details'>
{UserDataRedux?.images?.picture_url ? <>
  <img
                      style={{

                        borderRadius: "13px",
                      }}
                      src={UserDataRedux?.images?.picture_url}
                      className="card-img-top custom-listing-image"
                      alt="No image found"
                      onError={replaceImage}
                    />
</>:<>
<img
            style={{ width: "20%", height: "20%",borderRadius:"20px" }}
              src="https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              className="card-img-top custom-booking-image m-3"
              alt="No image found"
        
            />
</>}


    <div className=' text-start custom-margin-listing'>
        <div><b>Title </b>: <i>{UserDataRedux.name}</i></div>
        <div><b>Summary </b>: <i>{UserDataRedux.summary}</i></div>
        <div><b>Description </b>: <i>{UserDataRedux.description}</i></div>
        <div><b>Address </b>: <i>{UserDataRedux.address}</i></div>
        <div><b>Price </b>: <i>{UserDataRedux.price}</i></div>
        <div><b>Rooms </b>: <i>{UserDataRedux.bedrooms}</i></div>
        <div><b>Bathrooms </b>: <i>{UserDataRedux.bathrooms}</i></div>
        <div><b>Cancellation Policy </b>: <i>{UserDataRedux.cancellation_policy}</i></div>
        <div><b>Date Posted </b>: <i>{UserDataRedux.date.slice(0,10)}</i></div>
    </div>
    </div>
        <div className='text-start mt-2'>
        <button  className="btn btn-dark mt-auto m-1 w-auto customBtnHover" onClick={()=>navigate('/host/UpdateListing')}>Update Listing</button>
        <button  className="btn btn-dark mt-auto m-1 w-auto customBtnHover"  onClick={DeleteListing}>Delete Listing</button>
        </div>
     </> 
       
    
      
        
        

    
    :<>
    <h4>No Listing Yet</h4>
    <div className='d-flex justify-content-center'>
      {!UserDataRedux?.name? <>
        <Link to="/host/UpdateListing">
            <div className="card m-2 customHover" style={{ width: "19rem" }}>
              <img className="card-img-top" src="https://res.cloudinary.com/dpbhb8hqb/image/upload/v1676818406/Create_New_Listing-logos_ztddkl.jpg" alt="My Listing" />
            
             
            
            </div>
            </Link>
      </>:""}
   
    </div></>
    }
    
    
    </>)
}
