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
export const ViewDetails = () => {
  const [userDataState, setUserDataState] = useState<String[]>([]);
  const [addedToFavourites, setAddedToFavourites] = useState(false)

  const [userTypeUser, setUserTypeUser] = useState(false);
  const isLoading = useSelector((state:RootState)=>state.LoaderSlice.value)

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
      });
    }
  };
  
  
  

 

  useEffect(() => {
    let token = cookies.get("token");
    // @ts-ignore
    let LastViewDetailPage = JSON.parse(localStorage.getItem("LastViewDetailPage"));
    
    
    // @ts-ignore
    let userType = JSON.parse(localStorage.getItem("UserType"));
    if (userType === "User") {
      setUserTypeUser(true);
      if(token){
        axios({
        method: "post",
        url: "/user/MyUserProfile",
        headers: {
          Authorization: `Bearer ${token}`,
          "content-type": "application/x-www-form-urlencoded;charset=utf-8",
        },
      }).then((res) => {
        // console.log("rrsponse from favourites", res.data);
        setUserDataState(res.data);
        dispatch(FavouritesData(res.data?.newData));
       
      });
      }
    }
     else {
      setUserTypeUser(false);
    }
   

    if (LastViewDetailPage) {
      dispatch(viewDetailsData(LastViewDetailPage));
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
     
        <>
          <div className="custom-viewDetailsContainer ">
            {viewDetailsRedux?.images?.picture_url?
            <img
              style={{ width: "100%", height: "22rem",borderRadius: "13px" }}
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
            
            <div className="custom-overview p-2 m-1">
              <h2 style={{ textAlign: "left" }}>{viewDetailsRedux.name}</h2>
              <h4 style={{ textAlign: "left" }}><i>Overview</i></h4>
              <div className="text-start m-1">{viewDetailsRedux.summary}</div>
              {viewDetailsRedux?.address?.street ? (
                      <>
                        <p className="text-start m-2">
                          <i> Address : </i> <b>  {viewDetailsRedux?.address?.street},
                          {viewDetailsRedux?.address?.government_area},
                          {viewDetailsRedux?.address?.country}</b>
                        </p>
                      </>
                    ) : (
                      <p className="text-start m-2"> Address {viewDetailsRedux?.address}</p>
                    )}
              {viewDetailsRedux?.review_scores?.review_scores_rating ? <div className="text-start m-1">Average Rating :<b> {viewDetailsRedux?.review_scores?.review_scores_rating}</b></div> :
              ""}
              {viewDetailsRedux?.property_type ? <div className="text-start m-1"> Propert Type: <b>{viewDetailsRedux?.property_type}</b></div>: ""}
              {viewDetailsRedux?.price? <div className="text-start m-1"><b>Price: ${viewDetailsRedux.price}</b></div>:""}
              <div className="custom-buttons text-start mt-3">
                 {userTypeUser ? (
                  <>
                  {addedToFavourites?<>
                    <button
                  className="slign-self-end btn btn-dark mt-auto m-1 customBtnPosition px-5"
                  onClick={removeFromFavourites}
                >
                  Remove from Favourites
                </button>
                  
                  </>:
                  <>
                   <button
                    className="slign-self-end btn btn-dark mt-auto m-1 customBtnPosition px-5"
                    onClick={addToFavourites}
                  >
                    Add to Favourites
                  </button>
                  </>
                  }
                    
                  
                   
                
                
                <DatePickerModal />
              </>):""}
               
              </div>
            </div>
          </div>

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
         
        </>
      
    </>
  ) : (
    <h3>No data</h3>
  );
};
