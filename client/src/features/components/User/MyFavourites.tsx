import axios from "axios";
import React, { useEffect, useState } from "react";
import { Cookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import ListingCard from "../ListingCard";
import { FavouritesData } from "../../FavouritesReducer/FavouritesSlice";
import { useNavigate } from "react-router-dom";
import { LoaderStatus } from "../../LoaderReducer/LoaderSlice";
import { Loader } from "../Loader";

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
    })
  }

  useEffect(() => {
    dispatch(LoaderStatus(true)) 
    let token = cookies.get("token");
    // console.log("token in useEfect:", token)
    
    axios({
      method: "post",
      url: "/user/MyUserProfile",
      headers: {
        Authorization: `Bearer ${token}`,
        "content-type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    }).then((res) => {
      // console.log("rrsponse from favourites", res.data);
      dispatch(LoaderStatus(false)) 
      setUserFavouritesState(res.data?.newData?.favourites);
      dispatch(FavouritesData(res.data.newData));
      // console.log("User state data" , userDataState)
    });
  }, []);
  

  return (
    <>
      <h3 className="text-start mb-5 ml-2 mt-2">
        <i>My Favourites</i>
      </h3>
      {/* {isLoading===true?<>
      <Loader loading={isLoading}/>
     </>:<> </>} */}
      { userFavouritesState
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
                           Address : <b> {fav?.address?.street},
                          {fav?.address?.government_area},
                          {fav?.address?.country}</b>
                        </p>
                      </>
                    ) : (
                      <p className="text-start m-2"> Address <b> {fav?.address}</b></p>
                    )}
                    <p className="text-start m-2">Rating : <b> {fav?.review_scores?.review_scores_rating} </b></p>
                    <p className="text-start m-2">
                      Price <b>${fav.price}</b>
                    </p>
                    <button
                      className="btn btn-dark m-2 px-3 "
                      style={{ width: "fit-content" }}
                      onClick={()=>{removeFromFavourites(fav.fav_id)}}
                    >
                      Remove From Favourites
                    </button>
                    <button
                      className="btn btn-dark m-2 px-3 "
                      style={{ width: "fit-content" }}
                      onClick = {()=>{goToListing(fav?.host?.host_id)}}
                    >
                      View Listing
                    </button>
                  </div>
                </div>
              
            );
          })
        : "Nothing in favourites"}
       
    </>
  );
};
