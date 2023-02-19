import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import { useDispatch,useSelector } from 'react-redux'
import { RootState } from '../../../app/store'
import ListingCard from '../ListingCard'
import { FavouritesData } from '../../FavouritesReducer/FavouritesSlice'
import { useNavigate } from 'react-router-dom'
import { userData } from '../../UserDataReducer/UserDataSlice'
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import { LoaderStatus } from '../../LoaderReducer/LoaderSlice'


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

  const CreateNewListing = ()=>{
      navigate('/host/UpdateListing')
  }
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
      let name1= res.data.credentials.name
      if(name1){

        setListingExist(true)
      }
      else{
        setListingExist(false)
      }
      dispatch(userData(res.data))
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
    dispatch(LoaderStatus(false))
  },[])
 
  
  return (
    <>
  {showGreen?<>
      <Alert className="col-12 col-md-8 col-lg-6 p-1" show={showGreen} variant="success" >
        <p>{alertValue}</p>
        <Button style={{fontSize:"80%"}} onClick={() => 
          {setShowGreen(false)
          }
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
  
    {listingExist?
    <>
<div className='listing-details d-flex flex-column flex-xl-row mt-1'>
{UserDataRedux?.images?.picture_url ? <>
  <img
                      style={{
                        width: "20%",
                        height: "20%",
                        borderRadius: "20px",
                      }}
                      src={UserDataRedux?.images?.picture_url}
                      className="card-img-top custom-booking-image"
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


    <div className=' text-start m-4'>
        <h6>Name : <i>{UserDataRedux.name}</i></h6>
        <h6>Summary : <i>{UserDataRedux.summary}</i></h6>
        <h6>Description : <i>{UserDataRedux.description}</i></h6>
        <h6>Address : <i>{UserDataRedux.address}</i></h6>
        <h6>Price : <i>{UserDataRedux.price}</i></h6>
        <h6>Rooms : <i>{UserDataRedux.rooms}</i></h6>
        <h6>Bathrooms : <i>{UserDataRedux.bathrooms}</i></h6>
        <h6>Cancellation Policy : <i>{UserDataRedux.cancellation_policy}</i></h6>
        <h6>Date Posted : <i>{UserDataRedux.date.slice(0,10)}</i></h6>
    </div>
    </div>
        <div className='text-start'>
        <button  className="btn btn-dark mt-auto m-1 w-auto customBtnHover" onClick={CreateNewListing}>Update Listing</button>
        <button  className="btn btn-dark mt-auto m-1 w-auto customBtnHover"  onClick={DeleteListing}>Delete Listing</button>
        </div>
     </> 
       
    
      
        
        

    
    :<>
    <h4>No Listing Yet</h4>
    <div className='text-start'>
    <button  className=" btn btn-dark mt-auto m-1 w-auto customBtnHover" onClick={CreateNewListing}>Create New Listing</button>
    </div></>
    }
    
    
    </>)
}
