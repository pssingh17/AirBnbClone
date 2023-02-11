import axios from 'axios'
import React,{useEffect, useState} from 'react'
import ListingCard from './ListingCard'

import { useDispatch,useSelector } from 'react-redux'
import { RootState } from '../../app/store'
import { allListingsData } from '../AllListingsReducer/AllListingsSlice'
import { Pagination } from './common/Pagination'
import { Loader } from './Loader'



export const TopPicks = () => {
    const [listings, setlistings] = useState <String []>([])
    const [isLoading, setIsLoading] = useState(true);

    const dispatch = useDispatch()
    const listingsData:any = useSelector((state: RootState) => state.AllListingsSlice.value)
    
    

    useEffect(()=>{
        axios.post("/api/topPicks").then(res=>{
            // console.log(res.data)
            setIsLoading(false)
            setlistings(res.data.newData)
            dispatch(allListingsData(res.data))
        }).catch(err=>{console.log(err)})
    },[])
  return (<>
   {isLoading?<>
               <Loader loading={isLoading}/>
               </>:<>
               
               {listingsData.newData?listingsData.newData.map((item : any)=>{
        return (
            
       <ListingCard key={item._id || item.listing_url.substring(item.listing_url.lastIndexOf('/') + 1)} listing={item}/>
        )

    })
    :
    "NO data found"}
    <Pagination dataFrom="topPicks" page={listingsData.page}/>
               </>}
 
    
    </>
  )
}
