import React,{useState,useEffect} from 'react'
import { useForm, SubmitHandler } from "react-hook-form";
import { useCookies } from 'react-cookie';
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../app/store';
import axios from 'axios';
import { userData } from '../../UserDataReducer/UserDataSlice';
import { useNavigate } from 'react-router-dom';
import { ListingDataInterface } from '../../../model/ListingDataInterface';

type FormValues = ListingDataInterface

export const UpdateListingPage = () => {
  const [cookie, setCookie, removeCookie] = useCookies(['token']);
  const [userDataState,setUserDataState] = useState<String[]>([])
  // @ts-ignore
  const UserDataRedux = useSelector((state: RootState) => state.UserDataSlice.value.credentials)


  const dispatch = useDispatch()
    const navigate = useNavigate()
  const { register, handleSubmit , formState: { errors }} = useForm<FormValues>();
  const [field,setField] = useState("hello")
  const onSubmit: SubmitHandler<FormValues> = ((data) => {
    let token = cookie.token
    var body ={
      "name": data.name,
      "description": data.description,
      "summary": data.summary,
      "address": data.address,
      "rooms": data.bedrooms,
      "bathrooms": data.bathrooms,
      "price": data.price,
      "cancellation_policy": data.cancellation_policy,
      "userType": "Host",
      "listing_url":data.name+data.description,
      "images.picture_url": data?.images?.picture_url,
      "host":{"host_id":Date.now()},
    }
    // console.log(data)
    axios({
      
      method: 'post',
      
      url: '/host/updateHostListing',
      
      data:body, 
      headers: {
        Authorization: `Bearer ${token}`,
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      }
    }).then(res=>{
      
      // if(res.data.favourites){

      //   localStorage.setItem("User Favourites",JSON.stringify(res.data.credentials.favourites))
      // }
      // console.log("hostsignup respose:", res.data)

      // let cookieCheck = cookie.token
      // console.log("Cookie check:",cookieCheck)
      if(res.data.message==="Update Success"){
        dispatch(userData(res.data))
      localStorage.setItem("User Data",JSON.stringify(res.data))
      localStorage.setItem("UserType",JSON.stringify(res.data.credentials.userType))

        setCookie("token",res.data.token,{path:'/'})
        return navigate('/host/MyListing')
      }
      else{
        alert(res.data)
      }
      // console.log(res.data)
      
    }
      ).catch(err=>{console.log(err)})
    
  });
  useEffect(()=>{
    let token = cookie.token
    axios({
      method:'post',
      url: '/host/updateHostListing',
      headers: {
        Authorization: `Bearer ${token}`,
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      }
    }).then(res=>{
      // console.log("rrsponse from myHostProfile",res.data)
      setUserDataState(res.data)
      dispatch(userData(res.data))
    })
  },[])

    return (
        <div className="vh-80 d-flex justify-content-center align-items-center">
          <div className="container">
            <div className="row d-flex justify-content-center">
              <div className="col-12 col-md-8 col-lg-6">
                <div className="card bg-white">
                  <div className="card-body p-5">
                    <form className="mb-3 mt-md-4 " onSubmit={handleSubmit(onSubmit)}>
                      <h5 className="fw-bold mb-2 text-uppercase text-s">
                        Enter Details
                      </h5>
                      <p>All Fields Required</p>
    
                      <div className="mb-3">
                        <p className="form-label text-start ">Title</p>
                        <input
                          type="name"
                          className="form-control"
                          {...register("name",{ required: true,minLength:3, maxLength: 20 }) } defaultValue={UserDataRedux?.name}
                        />
                        {errors.name && <p style={{color:"red"}}>Name should be 3-20 Characters Long</p>}
                      </div>
                      <div className="mb-3">
                        <p className="form-label text-start">Description</p>
                        <input
                          type="description"
                          className="form-control"
                          {...register("description",{ required: true,minLength:30, maxLength: 2000 })}  defaultValue={UserDataRedux?.description}
                        />
                        {errors.description && <p style={{color:"red"}}>Descriptiom should be 30-2000 Characters Long</p>}

                      </div>
                      <div className="mb-3">
                        <p className="form-label text-start">Summary</p>
                        <input
                          type="text"
                          className="form-control"
                          {...register("summary",{ required: true,minLength:20, maxLength: 100 })} defaultValue={UserDataRedux?.summary}
                        />
                        {errors.summary && <p style={{color:"red"}}>Summary should be 20-100 Characters Long</p>}

                      </div>
                      <div className="mb-3">
                        <p className="form-label text-start">Address</p>
                        <input
                          type="text"
                          className="form-control"
                          {...register("address",{ required: true,minLength:10})} defaultValue={UserDataRedux?.address}
                        />
                        {errors.address && <p style={{color:"red"}}>Address should be atleast 10 Characters</p>}

                      </div>
                      <div className="mb-3">
                        <p className="form-label text-start">Rooms</p>
                        <input
                          type="number"
                          className="form-control"
                          {...register("bedrooms",{required: true,
                            min: 1,max:10
                          })} defaultValue={UserDataRedux?.bedrooms}
                        />
                        {errors.bedrooms && <p style={{color:"red"}}>Must be a valid number between 1 & 10</p>}

                      </div>
                      <div className="mb-3">
                        <p className="form-label text-start">Bathrooms</p>
                        <input
                          type="number"
                          className="form-control"
                          {...register("bathrooms",{required: true,
                            min: 1,max:10
                          })} defaultValue={UserDataRedux?.bathrooms}
                        />
                        {errors.bathrooms && <p style={{color:"red"}}>Must be a valid number between 1 & 10</p>}

                      </div>
                      <div className="mb-3">
                        <p className="form-label text-start">Price</p>
                        <input
                          type="number"
                          className="form-control"
                          {...register("price",{required: true,
                            min: 50
                          })} defaultValue={UserDataRedux?.price}
                        />
                        {errors.price && <p style={{color:"red"}}>Price should be valid number more than 50</p>}

                      </div>
                      <div className="mb-3">
                        <p className="form-label text-start">Image Link</p>
                        <input
                          type="text"
                          className="form-control"
                          {...register("images.picture_url",{
                            
                          })} defaultValue={UserDataRedux?.images?.picture_url}
                        />
                        {errors.price && <p style={{color:"red"}}>Enter valid link</p>}

                      </div>
                      <div className="mb-3">
                        <p className="form-label text-start">Cancellaton Policy</p>
                        <input
                          type="text"
                          className="form-control"
                          {...register("cancellation_policy",{ required: true,minLength:10})} defaultValue={UserDataRedux?.cancellation_policy}
                        />
                        {errors.cancellation_policy && <p style={{color:"red"}}>Policy should be atleast 10 Characters Long</p>}

                      </div>
                     
                      <div className="d-grid">
                      
                      <button className="btn btn-outline-dark" type="submit">Update Listing</button>
                      </div>
                    </form>
                    
              
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
}
