import axios from "axios";
import React, { useEffect, useState } from "react";
import { Cookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import ListingCard from "../ListingCard";
import { FavouritesData } from "../../FavouritesReducer/FavouritesSlice";
import { useNavigate } from "react-router-dom";
import { LoaderStatus } from "../../LoaderReducer/LoaderSlice";
import axiosRetry from "axios-retry";


export const MyFavourites = () => {
  let cookies = new Cookies();
  let dispatch = useDispatch();
  let navigate = useNavigate()
  const isLoading = useSelector((state:RootState)=>state.LoaderSlice.value)

  
  // @ts-ignore
  const MyFavouritesRedux = useSelector( (state: RootState) => state.FavouritesSlice?.value?.favourites
  );
  const viewDetailsRedux: any = useSelector(
    (state: RootState) => state.ViewDetailsSlice.value
  );
  const [userFavouritesState, setUserFavouritesState] = useState<String[]>(MyFavouritesRedux);
  const [errorImage, setErrorImage] = useState(
    "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  );
  // console.log("My fav redux:", MyFavouritesRedux);
  // @ts-ignore
  const replaceImage = (error) => {
    //replacement of broken Image
    error.target.src = errorImage;
  };
  const removeFromFavourites = (favId:any) => {
   
      let token = cookies.get("token");
      let newData = {
      
        fav_id:favId
      ,
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
        // console.log("rrsponse from myfavourites page", res.data);
        setUserFavouritesState(res.data?.credentials?.favourites)
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
      });
    }
  ;
  const goToListing = (Id:any)=>{
    let token = cookies.get('token')
    
    // console.log("token in useEfect:", token)
    axios({
      method:'post',
      url: `/api/getById`,
      data:{Id:Id},
      headers: {
        Authorization: `Bearer ${token}`,
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      
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
  useEffect(() => {
    let token = cookies.get("token");
    // console.log("token in useEfect:", token)
    // @ts-ignore
    let lstorageUType = JSON.parse(localStorage.getItem("UserType"))
    if(token != undefined && lstorageUType==="User"){
    dispatch(LoaderStatus(true))
    axios({
      method: "post",
      url: "/user/MyUserProfile",
      headers: {
        Authorization: `Bearer ${token}`,
        "content-type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    }).then((res) => {
    dispatch(LoaderStatus(false))

      // console.log("rrsponse from favourites", res.data);
      setUserFavouritesState(res.data?.newData?.favourites);
      dispatch(FavouritesData(res.data.newData));
      // console.log("User state data" , userDataState)
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
    });
  }
    else{
      navigate('/user/login')
      dispatch(LoaderStatus(false))
    }
  }, []);
  

  return (
    <>
      <h3 className="text-start mb-5 ml-2 mt-2">
        <i>My Favourites</i>
      </h3>
    
      { userFavouritesState?.length>0
        ? userFavouritesState?.map((fav: any) => {
            return (
              
                <div className="fav-container-child mb-3" key={fav.fav_id}>
                  {fav?.images?.picture_url ? (
                    <img
                      style={{
                        width: "20%",
                        height: "20%",
                        borderRadius: "20px",
                      }}
                      src={fav?.images?.picture_url}
                      className="card-img-top custom-booking-image"
                      alt="No image found"
                      onError={replaceImage}
                    />
                  ) : (
                    <img
                      style={{
                        width: "20%",
                        height: "20%",
                        borderRadius: "20px",
                      }}
                      src="https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                      className="card-img-top custom-booking-image"
                      alt="No image found"
                      onError={replaceImage}
                    />
                  )}
                  <div className="fav-details">
                    <h4 className="text-start m-2">
                      <i>{fav.name}</i>
                    </h4>
                    {fav?.address?.street ? (
                      <>
                        <p className="text-start m-2">
                           <b>Location :</b> <i> {fav?.address?.street},
                          {fav?.address?.government_area},
                          {fav?.address?.country}</i>
                        </p>
                      </>
                    ) : (
                      <p className="text-start m-2"><b> Address :</b><i> {fav?.address}</i></p>
                    )}
                    <p className="text-start m-2"><b>Rating :</b> {fav?.review_scores?.review_scores_rating || "No Ratings Yet"}
                    <i style={{fontWeight:"400"}}> {fav?.number_of_reviews && fav?.review_scores?.review_scores_rating ? <>({fav?.number_of_reviews})</>: ""}</i>
                     </p>
                    <p className="text-start m-2">
                     <b> Price : </b><i>${fav.price} Per Night</i>
                    </p>
                    <button
                      className="btn btn-dark m-2 px-3 customBtnHover"
                      style={{ width: "fit-content" }}
                      onClick={()=>{removeFromFavourites(fav.fav_id)}}
                    >
                      Remove From Favourites
                    </button>
                    <button
                      className="btn btn-dark m-2 px-3 customBtnHover"
                      style={{ width: "fit-content" }}
                      onClick = {()=>{goToListing(fav?.host?.host_id)}}
                    >
                      View Listing
                    </button>
                  </div>
                </div>
              
            );
          })
        : <><h3>Favourites List Empty</h3>
        <button className='btn btn-dark customBtnHover' style={{width:"10rem"}} onClick={()=>{navigate('/')}}>Browse Now</button>
      </>}
       
    </>
  );
};
