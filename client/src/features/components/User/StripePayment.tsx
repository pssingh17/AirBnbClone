import React,{useEffect,useRef,useState} from 'react'
import Stripe from 'react-stripe-checkout';
import axios from 'axios';
import { useSelector, useDispatch } from "react-redux";
import { RootState } from '../../../app/store';
import { useNavigate } from 'react-router-dom';
import { viewDetailsData } from '../../ViewDetailsReducer/ViewDetailsSlice';
import { useCookies } from 'react-cookie';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';


export const StripePayment = () => {
  const viewDetailsRedux: any = useSelector(
    (state: RootState) => state.ViewDetailsSlice.value
  );
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const navRef = useRef(useNavigate());
  
  const [cookie, setCookie, removeCookie] = useCookies(['token']);
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
    const handleToken = (totalAmount:any,token:any) =>{
        try{
          axios.post("/user/payment",{
            stripeToken:token.id,
            amount:viewDetailsRedux?.price,
          }).then(res=>{
            // console.log(res)
            if(res.status===200){
              let token = cookie.token
      let newData = {
        ...viewDetailsRedux,
        userType:"User",
        paymentDone: viewDetailsRedux?.price * viewDetailsRedux?.NumberOFDays,
        booking_id: viewDetailsRedux.listing_url.substring(
          viewDetailsRedux.listing_url.lastIndexOf("/") + 1
        ),
        listing_id: viewDetailsRedux?.host?.host_id,
        date: Date.now()
      };
      axios({
        method: "post",
        url: "/user/booking",
        data: newData,
        headers: {
          Authorization: `Bearer ${token}`,
          "content-type": "application/x-www-form-urlencoded;charset=utf-8",
        },
      }).then((res) => {
        // console.log("rrsponse from booking", res.data);
        setShowGreen(true)
        setAlertValue(res.data.message)
        // navRef.current('/user/bookings')
      }).catch(err=>{
        console.log("Error-",err)
        if (err?.response?.data?.loggedIn === false){
          console.log("Token expired.Please Verify- ", err?.response?.data.message)
          removeCookie("token")
          localStorage.clear()
          localStorage.setItem("AlertMessageLogin", JSON.stringify("Please verify your identity again"))
          navigate('/user/login')
        }
      });
            }
           });
        }catch(error){
          console.log(error)
        }
      }
      const tokenHandler = (token:any)=>{
        handleToken(100,token)
      }
      useEffect(()=>{
        // @ts-ignore
        let LastViewDetailPage = JSON.parse(localStorage.getItem("LastViewDetailPage"))
        // @ts-ignore
        let NumberOFDays = JSON.parse(localStorage.getItem("NumberOFDays"))
        // @ts-ignore
        let DateFrom = JSON.parse(localStorage.getItem("DateFrom"))
        let d = new Date(DateFrom)
        // console.log("Check kar day=",d.toLocaleDateString())
        DateFrom = d.toLocaleDateString()
       

        // @ts-ignore
        let DateTo = JSON.parse(localStorage.getItem("DateTo"))
        let d1 = new Date(DateTo)
        DateTo = d1.toLocaleDateString();
      
    
    // console.log("hi", LastViewDetailPage)
  
    if (LastViewDetailPage && NumberOFDays && DateFrom && DateTo) {
      let data = {...LastViewDetailPage,DateFrom,DateTo, NumberOFDays
      }
      dispatch(viewDetailsData(data));
    }
      },[])
     
    
  return (
    <>
     {showGreen?<>
      <Alert className="col-12 col-md-8 col-lg-6 p-1 d-flex align-items-center justify-content-between" show={showGreen} variant="success" >
        <p style={{marginBottom:"0"}}>{alertValue}</p>
        <Button style={{fontSize:"80%"}} onClick={() => 
          {setShowGreen(false)
          return navigate('/user/bookings')}
          } variant="outline-success">
            Close
            </Button>
      </Alert>
    </>:<>
    <Alert className="col-12 col-md-8 col-lg-6 p-1 d-flex align-items-center justify-content-between" show={showRed} variant="danger" >
        <p style={{marginBottom:"0"}}>{alertValue}</p>
        <Button style={{fontSize:"80%"}} onClick={() => setShowRed(false)} variant="outline-danger">
            Close
            </Button>
      </Alert></>
    
    }
      <h3 className='text-start p-3'>Booking Details</h3>
    <div className='custom-payment-container text-start'>
      <div className='custom-head'>
      {viewDetailsRedux?.images?.picture_url ? <>
        <img
              style={{ height: "21rem",borderRadius:"20px" }}
              src={viewDetailsRedux?.images?.picture_url}
              className="customImgBook"
              alt="No image found"
              onError={replaceImage}
            />
      </>:
       <img
       style={{ height: "21rem",borderRadius:"20px" }}
       src="https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
       className="customImgBook"
       alt="No image found"
       onError={replaceImage}
     />
      }
   
    <div className='custom-details text-start p-2'>
    <div><h4>{viewDetailsRedux?.name}</h4></div>
    {viewDetailsRedux?.address.street ? <>
    <div>Address : <b><i>{viewDetailsRedux?.address.street},{viewDetailsRedux?.address.suburb},{viewDetailsRedux?.address.country}</i></b></div>
    </>:<>Address : {viewDetailsRedux?.address.street}</>}
    <p className='mb-0'>Rating : <b><i> {viewDetailsRedux.newData?.review_scores?.review_scores_rating || "No Ratings Yet"} </i></b></p>
    <div>Cancellation Policy : <b><i>{viewDetailsRedux?.cancellation_policy}</i></b></div>
    <div>Price Per Night : <b><i>{viewDetailsRedux?.price}</i></b></div>
    <div>Dates Selected : <b><i>From {viewDetailsRedux?.DateFrom} to {viewDetailsRedux?.DateTo} - {viewDetailsRedux?.NumberOFDays} Days</i></b></div>
    </div>
   
   </div>
   <div><b><i>Continue to pay : ${viewDetailsRedux?.price* (viewDetailsRedux?.NumberOFDays)}</i></b></div>
    <Stripe stripeKey='pk_test_51MUqu0K16nSfUndiDYDDQwKwc7ODG00g2inFW5YZdGgYVdCZVGtWnelJw5uUQbOCavzOStGQGR18JM7R8am5Xm2R004ZZV1Kps' token={tokenHandler} 
    shippingAddress
    billingAddress
    />
    </div>
    </>
  )
}
