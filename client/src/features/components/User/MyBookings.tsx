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
import { Loader } from '../Loader'


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
    })
  }
  useEffect(()=>{
    let token = cookies.get('token')
    dispatch(LoaderStatus(false))
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
      
    })
  },[])
  useEffect(()=>{
    if(MyBookingsRedux?.length>1){

      SetMyBookingsReduxState([...MyBookingsRedux].reverse())
    }
   },[MyBookingsRedux])
  return (
    MyBookingsReduxState?.length>0? 
    <>
     <h3 className='text-start mb-5 ml-2 mt-2'><i>MyBookings</i></h3>
     {isLoading===true?<>
      <Loader loading={isLoading}/>
     </>:<> </>}
    {MyBookingsReduxState?.map((booking:any)=>{
      return(
        <div key={booking?.date} className="custom-booking-child-container mb-3">
        {booking.paymentDone?
        <>
       {booking?.images?.picture_url?
            <img
            style={{ width: "20%", height: "20%",borderRadius:"20px" }}
              src={booking?.images?.picture_url}
              className="card-img-top custom-booking-image"
              alt="No image found"
              onError={replaceImage}
            />:
            <img
            style={{ width: "20%", height: "20%",borderRadius:"20px" }}
              src="https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              className="card-img-top custom-booking-image"
              alt="No image found"
              onError={replaceImage}
            />
            }
         <div className='bDetails-Container'>
         <h4 className='text-start m-2'><i>{booking.name}</i></h4>
         <p className='text-start m-2'>From <i> <b>{booking?.DateFrom} to {booking?.DateTo} </b></i></p>
        <p className='text-start m-2'>Total Days Booked : {booking.NumberOFDays}</p>
        <p className='text-start m-2'>Payment received: <b>${booking.paymentDone}</b></p>
        <button
          className="btn btn-dark m-2 "
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
    :<h5>No bookings yet</h5>
  )
}
