import React,{useEffect, useState} from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { RootState } from "../../../app/store";
import { useDispatch ,useSelector} from 'react-redux'
import { Cookies } from 'react-cookie'
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { viewDetailsData } from "../../ViewDetailsReducer/ViewDetailsSlice";

// import Cookies from 'js-cookie'

type FormValues = {
 comment:String,
 
};



export const AddReview = () => {
  const ReviewsRedux: any = useSelector(
    (state: RootState) => state.ViewDetailsSlice.value?.reviews
  );
  const cookies = new Cookies(); 

  const [reviewerExist, setReviewerExist] = useState(false)
  const[reviewerEmail, setReviewerEmail] = useState()
    const [displayCommentBox, setDisplayCommentBox] = useState(false)
    const dispatch = useDispatch()
  const [cookie, setCookie, removeCookie] = useCookies(['token']);
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();
  const viewDetailsRedux: any = useSelector(
    (state: RootState) => state.ViewDetailsSlice.value
  );
  // @ts-ignore
  const MyFavouritesRedux = useSelector( (state: RootState) => state.FavouritesSlice?.value)
  // @ts-ignore
  const MyFavouritesReduxEmail = useSelector( (state: RootState) => state.FavouritesSlice?.value?.email
  );
    const displayBox = ()=>{
        setDisplayCommentBox(true)
    }

    const onSubmit: SubmitHandler<FormValues> = ((data) => {
        let token = cookie.token
        let date = new Date()
        var body ={
          "comments": data.comment,
          "host_id":viewDetailsRedux?.host?.host_id ,
          "name": MyFavouritesReduxEmail.slice(0,10),
          "email": MyFavouritesReduxEmail,
          "date": date.toISOString(),
          "userType": "User"
        }
        // console.log(data)
        axios({
          
          method: 'post',
          
          url: '/user/addReview',
          
          data:body, 
          headers: {
            Authorization: `Bearer ${token}`,
            'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
          }
        }).then(res=>{
          // console.log("response from reviews:",res.data)
          localStorage.setItem("LastViewDetailPage",JSON.stringify(res?.data?.credentials))
          dispatch(viewDetailsData(res?.data?.credentials));
          }).catch(err=>{console.log(err)})
        
      });
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
       },[ReviewsRedux])
  return (
  <div className="text-start">
    {!reviewerExist?<>
      <button
    className=" w-auto btn btn-dark mt-auto m-1  customBtnPosition px-4" onClick={displayBox} > Add Review</button>
    {displayCommentBox?<>
    <form className="mb-3 mt-md-4 " onSubmit={handleSubmit(onSubmit)}>
        <textarea
                      style={{width:"50%"}}
                      className="form-control customTextArea"
                      {...register("comment",{
                        required: true,
                        pattern: /.{10,2000}$/
                    })}
                     
                    />
        {errors.comment && <span style={{color:"red"}}>This field requires minimum 10 characters</span>}
        
<button className="btn btn-outline-dark d-block mt-1 px-4" type="submit">Post</button>
</form>

    </>:""}
    </>:""}
    
    
 </div> )
}
