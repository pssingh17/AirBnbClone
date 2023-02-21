import axios from 'axios'
import React,{useEffect, useState} from 'react'
import ListingCard from './ListingCard'

import { useDispatch } from 'react-redux'
import { allListingsData } from '../AllListingsReducer/AllListingsSlice'
import type { RootState } from '../../app/store'
import { useSelector } from 'react-redux'
import { Pagination } from './common/Pagination'
import { searchListingData } from '../SearchListingReducer/SearchListingSlice'
import { useNavigate } from 'react-router-dom'
import { LoaderStatus } from '../LoaderReducer/LoaderSlice'




export const SearchListing = () => {
    const [listings, setlistings] = useState <String []>([])
  const isLoading = useSelector((state:RootState)=>state.LoaderSlice.value)

    const navigate = useNavigate()
    const dispatch = useDispatch()
    let listingsData : any = useSelector((state: RootState) => state.AllListingsSlice.value)
   // console.log(listingsData)
    // @ts-ignore
    const searchlistingsData = useSelector((state: RootState) => state.SearchListingSlice.value.newData)
    // @ts-ignore
    const searchlistingspage = useSelector((state: RootState) => state.SearchListingSlice.value.page)
    const HomePage = ()=>{
     return navigate('/')
    }
    useEffect(()=>{
      // @ts-ignore
      let searchString = JSON.parse(localStorage.getItem("SearchString"))
      if(searchString != undefined){
        var body ={
          "searchString": searchString,
        }
       
        axios({
      
          method: 'post',
          
          url: 'http://localhost:8000/api/search',
          
          data:body, 
          headers: {
            'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
          }
        }).then(res=>{
        //  console.log("Search data", res.data)
         if(res.data){
          dispatch(searchListingData(res.data))
          dispatch(LoaderStatus(false))
         }
        }).catch(err=>{console.log(err)
        navigate('/')
        })
      }

    },[])
 
  return (<>
 

    {searchlistingsData?searchlistingsData.map((item : any)=>{
        return (
            
       <ListingCard key={item._id || item.listing_url.substring(item.listing_url.lastIndexOf('/') + 1)} listing={item}/>
        )

    })
    :
    <><h5>No Data found</h5>
    <button type='button' className='btn btn-dark w-auto customBtnHover' onClick={HomePage}>Go Back to Home Page</button></>}
    <Pagination dataFrom="search" page={searchlistingspage}/>
    
    </>

  )
}
