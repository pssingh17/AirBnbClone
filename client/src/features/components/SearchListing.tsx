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
  //   useEffect(()=>{
  //     axios.post("http://localhost:8000/api/getAll").then(res=>{
  //         // console.log(res.data)
  //         setlistings(res.data.newData)
  //         dispatch(searchListingData(res.data))
  //     }).catch(err=>{console.log(err)})
  // },[])
 
  return (<>
 

    {searchlistingsData?searchlistingsData.map((item : any)=>{
        return (
            
       <ListingCard key={item._id || item.listing_url.substring(item.listing_url.lastIndexOf('/') + 1)} listing={item}/>
        )

    })
    :
    <><h5>No Data found</h5>
    <button type='button' className='btn btn-dark w-auto' onClick={HomePage}>Go Back to Home Page</button></>}
    <Pagination dataFrom="search" page={searchlistingspage}/>
    
    </>

  )
}
