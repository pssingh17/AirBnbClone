import axios from 'axios'
import React,{useEffect, useState} from 'react'
import ListingCard from './ListingCard'
import { RootState } from '../../app/store'
import { useDispatch,useSelector } from 'react-redux'
import { allListingsData } from '../AllListingsReducer/AllListingsSlice'
import { Pagination } from './common/Pagination'



export const Trending = () => {
    const [listings, setlistings] = useState <String []>([])
    const dispatch = useDispatch()
  let listingsData : any = useSelector((state: RootState) => state.AllListingsSlice.value)


    useEffect(()=>{
        axios.get("/api/Popular").then(res=>{
            // console.log(res.data)
            setlistings(res.data.newData)
            dispatch(allListingsData(res.data))
        }).catch(err=>{console.log(err)})
    },[])
  return (<>
 
 
    {listingsData.newData?listingsData.newData.map((item : any)=>{
        return (
            
       <ListingCard key={item._id || item.listing_url.substring(item.listing_url.lastIndexOf('/') + 1)} listing={item}/>
        )

    })
    :
    "NO data found"}
    <Pagination dataFrom="popular" page={listingsData.page}/>
    </>
  )
}
