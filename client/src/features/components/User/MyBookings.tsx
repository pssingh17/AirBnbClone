import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Cookies } from 'react-cookie'
import { useDispatch,useSelector } from 'react-redux'
import { RootState } from '../../../app/store'
import ListingCard from '../ListingCard'
import { FavouritesData } from '../../FavouritesReducer/FavouritesSlice'
import { userData } from '../../UserDataReducer/UserDataSlice'
import { useNavigate } from 'react-router-dom'
import { LoaderStatus } from '../../LoaderReducer/LoaderSlice'
import axiosRetry from 'axios-retry'



export const MyBookings = () => {
  let cookies = new Cookies()
  const [MyBookingsReduxState, SetMyBookingsReduxState] = useState<any>()
  const isLoading = useSelector((state:RootState)=>state.LoaderSlice.value)


  let dispatch = useDispatch()
  let navigate = useNavigate()
  const [errorImage, setErrorImage] = useState(
    "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  );

  // @ts-ignore
  const MyBookingsRedux:any = useSelector((state: RootState) => state.UserDataSlice?.value?.newData?.bookings)
  // console.log("My booking redux:", MyBookingsRedux)
   // @ts-ignore
   const replaceImage = (error) => {
    //replacement of broken Image
    error.target.src = errorImage;
  };
  const goToListing = (Id:any)=>{
    let token = cookies.get('token')

    axios({
      method:'post',
      url: `/api/getById`,
      data:{Id:Id},
      headers: {
        Authorization: `Bearer ${token}`,
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      }
    }).then(res=>{
      // console.log("rrsponse from booking my fav",res.data)
      // dispatch(userData(res.data))
      let data = res.data?.newData
      // console.log("data response for Lvd", data)
      localStorage.setItem("LastViewDetailPage",JSON.stringify(data))
      navigate('/viewDetails')
    }).catch(err=>{
      console.log("Error-",err)
      if (err?.response?.data?.loggedIn === false){
        console.log("Token expired.Please Verify- ", err?.response?.data.message)
        cookies.remove("token")
        localStorage.clear()
        localStorage.setItem("AlertMessageLogin", JSON.stringify("Please verify your identity again"))
        navigate('/user/login')
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
    let token = cookies.get('token')
     // @ts-ignore
    let lstorageUType = JSON.parse(localStorage.getItem("UserType"))
    if(token != undefined && lstorageUType==="User"){

    
    dispatch(LoaderStatus(true))
    // console.log("token in useEfect:", token)
    axios({
      method:'post',
      url: '/user/MyUserProfile',
      headers: {
        Authorization: `Bearer ${token}`,
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      }
    }).then(res=>{
      // console.log("rrsponse from booking",res.data)
      dispatch(userData(res.data))
    dispatch(LoaderStatus(false))

      
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
  useEffect(()=>{
    if(MyBookingsRedux?.length>0){

      SetMyBookingsReduxState([...MyBookingsRedux].reverse())
    }
   },[MyBookingsRedux])
  return (
    MyBookingsReduxState?.length>0? 
    <>
     <h3 className='text-start mb-5 ml-2 mt-2'><i>MyBookings</i></h3>
    
    {MyBookingsReduxState?.map((booking:any)=>{
      return(
        <div key={booking?.date} className="custom-booking-child-container mb-3">
        {booking.paymentDone?
        <>
       {booking?.images?.picture_url?
            <img
            style={{ width: "20%", height: "213px",borderRadius:"20px" }}
              src={booking?.images?.picture_url}
              className="card-img-top custom-booking-image"
              alt="No image found"
              onError={replaceImage}
            />:
            <img
            style={{ width: "20%", height: "213px%",borderRadius:"20px" }}
              src="https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              className="card-img-top custom-booking-image"
              alt="No image found"
              onError={replaceImage}
            />
            }
         <div className='bDetails-Container'>
         <h4 className='text-start m-2'><i>{booking.name}</i></h4>
         {booking?.address?.street ? (
                      <>
                        <p className="text-start m-2">
                           <b>Location :</b> <i> {booking?.address?.street},
                          {booking?.address?.government_area},
                          {booking?.address?.country}</i>
                        </p>
                      </>
                    ) : (
                      <p className="text-start m-2"><b> Address :</b><i> {booking?.address}</i></p>
                    )}
         <p className='text-start m-2'><b>From :</b> <i>{booking?.DateFrom} <b>to</b> {booking?.DateTo} </i></p>
        <p className='text-start m-2'><b>Total Days Booked :</b> <i>{booking.NumberOFDays}</i></p>
        <p className='text-start m-2'><b>Payment received :</b> <i>${booking.paymentDone}</i></p>
        <button
          className="btn btn-dark m-2 customBtnHover"
          style={{width:"10rem"}}
          onClick={()=>{goToListing(booking?.host?.host_id)}}
        >
          View Listing
        </button>
        </div>
        </>:" "
        }
       
        </div>
      )
     
    })}
   
   
   
    </>
    :<><h2>You have not booked anything Yet</h2>
    <button className='btn btn-dark customBtnHover' style={{width:"10rem"}} onClick={()=>{navigate('/')}}>Start Browsing</button>
   </>
  )
}
