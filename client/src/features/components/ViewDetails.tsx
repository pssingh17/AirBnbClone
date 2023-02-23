import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { RootState } from "../../app/store";
import axios from "axios";
import { Cookies } from "react-cookie";
import { viewDetailsData } from "../ViewDetailsReducer/ViewDetailsSlice";
import { useNavigate } from "react-router-dom";
import { FavouritesData } from "../FavouritesReducer/FavouritesSlice";
import { DatePicker } from "./User/DatePicker";
import { DatePickerModal } from "./User/DatePickerModal";
import { Reviews } from "./Reviews";
import { AddReview } from "./User/AddReview";
import UserDataSlice from "../UserDataReducer/UserDataSlice";
import { userData } from "../UserDataReducer/UserDataSlice";
import { LoaderStatus } from "../LoaderReducer/LoaderSlice";

export const ViewDetails = () => {
  const [userDataState, setUserDataState] = useState<String[]>([]);
  const [addedToFavourites, setAddedToFavourites] = useState(false)
  
  const [userTypeUser, setUserTypeUser] = useState<String>("none");
  const isLoading = useSelector((state:RootState)=>state.LoaderSlice.value)
  // @ts-ignore
  const ULogged = useSelector((state:RootState)=>state.UserDataSlice.value?.userType)
  const dispatch = useDispatch();
  const navigate = useNavigate();
 
  const cookies = new Cookies(); 

  const viewDetailsRedux: any = useSelector(
    (state: RootState) => state.ViewDetailsSlice.value
  );
    // @ts-ignore
    const MyFavouritesRedux = useSelector((state: RootState) => state.FavouritesSlice.value.favourites)
  const [errorImage, setErrorImage] = useState(
    "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  );
  
  
  // let FavCheck = MyFavouritesRedux.filter((favId:any)=>{
    
  // })

  
  // @ts-ignore
  const replaceImage = (error) => {
    //replacement of broken Image
    error.target.src = errorImage;
  };

  const addToFavourites = () => {
    if (userTypeUser) {
      // console.log("iside if:", userTypeUser)
      let token = cookies.get("token");
      let newData = {
        ...viewDetailsRedux,
        fav_id:viewDetailsRedux._id || viewDetailsRedux.listing_url.substring(
          viewDetailsRedux.listing_url.lastIndexOf("/") + 1
        ),
        date: Date.now()
      };
      axios({
        method: "post",
        url: "/user/addToFavourites",
        data: newData,
        headers: {
          Authorization: `Bearer ${token}`,
          "content-type": "application/x-www-form-urlencoded;charset=utf-8",
        },
      }).then((res) => {
        // console.log("rrsponse from favourites", res.data);
        // dispatch(FavouritesData(res.data?.credentials?.favourites));
        setAddedToFavourites(true)
      }).catch(err=>{
        console.log("Error-",err)
        if (err?.response?.data?.loggedIn === false){
          console.log("Token expired.Please Verify- ", err?.response?.data.message)
          cookies.remove("token")
          localStorage.clear()
          localStorage.setItem("AlertMessageLogin", JSON.stringify("Please verify your identity again"))
          navigate('/user/login')
        }
      });
    }
  };
  const removeFromFavourites = () => {
    if (userTypeUser) {
      let token = cookies.get("token");
      let newData = {
        ...viewDetailsRedux,
        fav_id:viewDetailsRedux._id || viewDetailsRedux.listing_url.substring(
          viewDetailsRedux.listing_url.lastIndexOf("/") + 1
        ),
      };
      // console.log("RF:", newData)
      axios({
        method: "post",
        url: "/user/removeFromFavourites",
        data: newData,
        headers: {
          Authorization: `Bearer ${token}`,
          "content-type": "application/x-www-form-urlencoded;charset=utf-8",
        },
      }).then((res) => {
        // console.log("rrsponse from favourites", res.data);
        setAddedToFavourites(false)
        dispatch(FavouritesData(res.data?.credentials?.favourites));

        // dispatch(addFavouritesData(viewDetailsRedux))
      }).catch(err=>{
        console.log("Error-",err)
        if (err?.response?.data?.loggedIn === false){
          console.log("Token expired.Please Verify- ", err?.response?.data.message)
          cookies.remove("token")
          localStorage.clear()
          localStorage.setItem("AlertMessageLogin", JSON.stringify("Please verify your identity again"))
          navigate('/user/login')
        }
      });;
    }
  };
  
  
  

 

  useEffect(() => {
    
    let token = cookies.get("token");
    // @ts-ignore
    let LastViewDetailPage = JSON.parse(localStorage.getItem("LastViewDetailPage"));
    
     
    if (LastViewDetailPage) {
      dispatch(viewDetailsData(LastViewDetailPage));
    }
  
    // @ts-ignore
    let userType = JSON.parse(localStorage.getItem("UserType"));
    if (userType === "User") {
      dispatch(LoaderStatus(true))
      setUserTypeUser("User");
      if(token){
        axios({
        method: "post",
        url: "/user/MyUserProfile",
        headers: {
          Authorization: `Bearer ${token}`,
          "content-type": "application/x-www-form-urlencoded;charset=utf-8",
        },
      }).then((res) => {
        // console.log("rrsponse from viewdetails", res.data);
        dispatch(userData(res.data?.newData))
        dispatch(FavouritesData(res.data?.newData));
    dispatch(LoaderStatus(false))

       
      }).catch(err=>{
        console.log("Error-",err)
        if (err?.response?.data?.loggedIn === false){
          console.log("Token expired.Please Verify- ", err?.response?.data.message)
          cookies.remove("token")
          localStorage.clear()
          localStorage.setItem("AlertMessageLogin", JSON.stringify("Please verify your identity again"))
          navigate('/user/login')
        }
      });;
      }
    }
     else if(userType === "Host"){
      dispatch(LoaderStatus(true))
      setUserTypeUser("Host")
      axios({
        method: "post",
        url: "/host/MyHostProfile",
        headers: {
          Authorization: `Bearer ${token}`,
          "content-type": "application/x-www-form-urlencoded;charset=utf-8",
        },
      }).then((res) => {
        // console.log("rrsponse from viewdetails", res?.data);
        dispatch(userData(res.data?.credentials))
        dispatch(FavouritesData(res.data?.credentials));
    dispatch(LoaderStatus(false))

       
      }).catch(err=>{
        console.log("Error-",err)
        if (err?.response?.data?.loggedIn === false){
          console.log("Token expired.Please Verify- ", err?.response?.data.message)
          cookies.remove("token")
          localStorage.clear()
          localStorage.setItem("AlertMessageLogin", JSON.stringify("Please verify your identity again"))
          navigate('/user/login')
        }
      });;
    }
   else{
    dispatch(LoaderStatus(false))
    setUserTypeUser("none")
   }
    
    
      
   
    // console.log("token in useEfect:", token)
    
   
    
  }, []);
  useEffect(()=>{
    let favId = viewDetailsRedux?._id || viewDetailsRedux?.listing_url.substring(viewDetailsRedux.listing_url.lastIndexOf("/") + 1)
    // console.log("favid", favId)
    let data = MyFavouritesRedux?.filter((fav:any)=>{ return fav.fav_id === favId})
    if(data?.length>0){
      // console.log("Inside lengthj")
      setAddedToFavourites(true)
    }
    else{
      setAddedToFavourites(false)
    }

  },[MyFavouritesRedux])

  // useEffect(()=>{console.log("added to favourites statys:", addedToFavourites)},[addedToFavourites])
  
  return viewDetailsRedux ? (
    <>
     
        <div className="modifiedContainer">
          <div className="custom-viewDetailsContainer ">
            {viewDetailsRedux?.images?.picture_url?
            <img
              style={{ width: "100%", height: "21rem",borderRadius: "13px" }}
              src={viewDetailsRedux?.images?.picture_url}
              className="card-img-top"
              alt="No image found"
              onError={replaceImage}
            />:
            <img
              style={{ width: "100%", height: "20rem",borderRadius:"13px" }}
              src="https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              className="card-img-top"
              alt="No image found"
              onError={replaceImage}
            />
            }
            
            <div className="custom-overview mt-2">
              <h2 style={{ textAlign: "left" }}>{viewDetailsRedux.name}</h2>
              <h4 style={{ textAlign: "left" }}><i>Overview</i></h4>
              <div className="text-start m-1">{viewDetailsRedux.summary}</div>
              {viewDetailsRedux?.address?.street ? (
                      <>
                        <p className="text-start m-1 my-2">
                          <i> Address : </i> <b>  {viewDetailsRedux?.address?.street},
                          {viewDetailsRedux?.address?.government_area},
                          {viewDetailsRedux?.address?.country}</b>
                        </p>
                      </>
                    ) : (
                      <p className="text-start my-2"> Address {viewDetailsRedux?.address}</p>
                    )}
              {viewDetailsRedux?.review_scores?.review_scores_rating ? <div className="text-start m-1 my-1">Average Rating :<b> {viewDetailsRedux?.review_scores?.review_scores_rating}</b></div> :
              ""}
              {viewDetailsRedux?.property_type ? <div className="text-start m-1"> Propert Type: <b>{viewDetailsRedux?.property_type}</b></div>: ""}
              {viewDetailsRedux?.price? <div className="text-start m-1"><b>Price: ${viewDetailsRedux.price}</b></div>:""}
              <div className="custom-buttons text-start mt-3">
                 {userTypeUser==="User" ? (
                  <>
                  {addedToFavourites?<>
                    <button
                  className="slign-self-end btn btn-dark mt-auto my-1 customBtnHover px-5"
                  onClick={removeFromFavourites}
                >
                  Remove from Favourites
                </button>
                  
                  </>:
                  <>
                   <button
                    className="slign-self-end btn btn-dark mt-auto m-1 customBtnHover px-5"
                    onClick={addToFavourites}
                  >
                    Add to Favourites
                  </button>
                  </>
                  }
                    
                  
                   
                
                
                
              </>):""}
              {userTypeUser === "Host" || ULogged ==="Host"?
              "":<><DatePickerModal /></>}
               
              </div>
            </div>
          </div>
          <div className="modifiedContainer2">
          <h3 className="text-start mt-2"><i>Description</i></h3>
          <div className="text-start">{viewDetailsRedux.description}</div>

          
          {viewDetailsRedux?.amenities?.length>0 ? <>
            <h3 className="text-start mt-4 mb-2"><i>What this place offers...</i></h3>
            <div className="text-start">
          {viewDetailsRedux.amenities.map((amenity:String,index:Number)=>{
            return <span className="badge bg-light custom-badge" style={{width:"auto !important"}} key={index as number}>{amenity}</span>
          })}
          </div>
          </>:""}
         

          <h3 className="text-start mt-4"><i>Reviews</i></h3>
          {userTypeUser ? (
                  <>
             <AddReview />
              </>):""}
         
          {viewDetailsRedux?.reviews?.length>0?
          <>
           <Reviews /></>:
          <p>No reviews yet</p>
        }
      </div>
        </div>
      
    </>
  ) : (
    <h3>No data</h3>
  );
};
