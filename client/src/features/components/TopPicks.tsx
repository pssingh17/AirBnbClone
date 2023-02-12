import axios from 'axios'
import React,{useEffect, useState} from 'react'
import ListingCard from './ListingCard'

import { useDispatch,useSelector } from 'react-redux'
import { RootState } from '../../app/store'
import { allListingsData } from '../AllListingsReducer/AllListingsSlice'
import { Pagination } from './common/Pagination'
import { Loader } from './Loader'
import { LoaderStatus } from '../LoaderReducer/LoaderSlice'



export const TopPicks = () => {
    const [listings, setlistings] = useState <String []>([])
  const isLoading = useSelector((state:RootState)=>state.LoaderSlice.value)


    const dispatch = useDispatch()
    const listingsData:any = useSelector((state: RootState) => state.AllListingsSlice.value)
    
    

    useEffect(()=>{
      dispatch(LoaderStatus(true))
        axios.post("/api/topPicks").then(res=>{
            // console.log(res.data)
            dispatch(LoaderStatus(false))
            setlistings(res.data.newData)
            dispatch(allListingsData(res.data))
        }).catch(err=>{console.log(err)})
    },[])
  return (<>
  <div className='mt-2 text-start'>
    <p style={{fontSize:"1.2rem",color:"white", display:"inline-block", padding:"0.3rem", backgroundColor:"#212529", borderRadius:"13px" ,marginBottom:"0"}}><i>Top Picks For You</i></p>
  </div>
    {isLoading===true?<>
      <Loader loading={isLoading}/>
     </>:<></>}
               
               {listingsData.newData?listingsData.newData.map((item : any)=>{
        return (
            
       <ListingCard key={item._id || item.listing_url.substring(item.listing_url.lastIndexOf('/') + 1)} listing={item}/>
        )

    })
    :
    "NO data found"}
    <Pagination dataFrom="topPicks" page={listingsData.page}/>
            
 
    
    </>
  )
}
