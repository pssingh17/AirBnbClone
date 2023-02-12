import axios from 'axios';
import React,{useState,useEffect} from 'react'
import { Cookies, useCookies } from 'react-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { viewDetailsData } from '../ViewDetailsReducer/ViewDetailsSlice';

export const Reviews = () => {
  const [ReviewsReduxState, SetReviewsReduxState] = useState<any>()
  const ReviewsRedux: any = useSelector(
    (state: RootState) => state.ViewDetailsSlice.value?.reviews
  );
 
  const [reviewerExist, setReviewerExist] = useState(false)
  const[reviewerEmail, setReviewerEmail] = useState()
  const cookies = new Cookies(); 
    const dispatch = useDispatch()
    const viewDetailsRedux: any = useSelector(
      (state: RootState) => state.ViewDetailsSlice.value
    );
  
    // @ts-ignore
    const MyFavouritesReduxEmail = useSelector( (state: RootState) => state.FavouritesSlice?.value?.email
    );
  const [cookie, setCookie, removeCookie] = useCookies(['token']);
  const reviewsPerRow = 4
  const [next, setNext] = useState(reviewsPerRow);
const handleMoreReviews = () => {
    setNext(next + reviewsPerRow);
  };
const deleteReview = (Id:String)=>{
  let token = cookie.token
  var body ={
    "date":Id,
    "host_id":viewDetailsRedux?.host?.host_id ,
    "userType": "User"
  }
  
  axios({
    
    method: 'post',
    
    url: '/user/deleteReview',
    
    data:body, 
    headers: {
      Authorization: `Bearer ${token}`,
      'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
    }
  }).then(res=>{
    // console.log("response from delted reviews:",res.data)
    localStorage.setItem("LastViewDetailPage",JSON.stringify(res?.data?.credentials))
    dispatch(viewDetailsData(res?.data?.credentials));
    }).catch(err=>{console.log(err)})
}
  useEffect(()=>{
    // @ts-ignore
    let userType = JSON.parse(localStorage.getItem("UserType"));
    if (userType === "User") {
      let token = cookies.get("token");
      // @ts-ignore
      let LastViewDetailPage = JSON.parse(localStorage.getItem("LastViewDetailPage"));
      
      
      // @ts-ignore
      let userType = JSON.parse(localStorage.getItem("UserType"));
      if (userType === "User") {
        if(token){
          axios({
          method: "post",
          url: "/user/MyUserProfile",
          headers: {
            Authorization: `Bearer ${token}`,
            "content-type": "application/x-www-form-urlencoded;charset=utf-8",
          },
        }).then((res) => {
            // console.log("responi", res?.data?.newData?.email)
          // dispatch(FavouritesData(res.data?.newData));
          let data = viewDetailsRedux?.reviews.filter((email:any)=>{ return email.email === res.data.newData.email})
          // console.log(data)
          if(data[0]){
           setReviewerExist(true)
           setReviewerEmail(data[0].email)
          }
          else{setReviewerExist(false)}
        });
        }
    
   
  }}
   },[])
   useEffect(()=>{
    SetReviewsReduxState([...ReviewsRedux].reverse())
    // @ts-ignore
    let userType = JSON.parse(localStorage.getItem("UserType"));
    if (userType === "User") {
      let token = cookies.get("token");
    if (userType === "User") {
      if(token){
        axios({
        method: "post",
        url: "http://localhost:8000/user/MyUserProfile",
        headers: {
          Authorization: `Bearer ${token}`,
          "content-type": "application/x-www-form-urlencoded;charset=utf-8",
        },
      }).then((res) => {
          // console.log("responi", res?.data?.newData?.email)
        // dispatch(FavouritesData(res.data?.newData));
        let data = viewDetailsRedux?.reviews.filter((email:any)=>{ return email.email === res.data.newData.email})
        // console.log(data)
        if(data[0]){
         setReviewerExist(true)
         setReviewerEmail(data[0].email)
        }
        else{setReviewerExist(false)}
      });
      }
  
 
}}
   },[ReviewsRedux])
  // console.log("Reviews:", ReviewsRedux)
  return (
    <>
    <div className="gap-y-4 flex flex-wrap justify-center" style={{    background: "#fafafa"}}>
      {ReviewsReduxState?.slice(0, next)?.map((review:any) => {
        return (
          <div
            key={review?.date}
            className="px-2.5 md:px-0"
          >
            <p className="text-start m-1"><b style={{color:"blue"}}>{review?.reviewer_name || review?.name}</b></p>
            
            <p className="text-start m-1">{review?.comments}</p>
            <p className="text-start m-1 mb-4"><i style={{color:"grey"}}>Date Posted  :<span style={{color:"black"}}> {review?.date?.slice(0,10)}</span></i></p>
            {reviewerExist && review?.email===reviewerEmail ?<div className='text-start'>
              <button className='btn btn-dark' onClick={()=>{deleteReview(review.date)}}>Delete</button>
            </div>:""
            
          }
            
            <hr></hr>
          </div>
        );
      })}
     {next < ReviewsReduxState?.length && (
        <button
          className="align-self-end btn btn-dark mt-auto m-1 customBtnPosition"
          onClick={handleMoreReviews}
        >
          Load more
        </button>
      )}
    </div>
  </>
  )
}
