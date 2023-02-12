import axios from 'axios'
import React,{useEffect, useState} from 'react'
import ListingCard from './ListingCard'
import { RootState } from '../../app/store'
import { useDispatch ,useSelector} from 'react-redux'
import { allListingsData } from '../AllListingsReducer/AllListingsSlice'
import { Pagination } from './common/Pagination'
import { Loader } from './Loader'
import { LoaderStatus } from '../LoaderReducer/LoaderSlice'




export const TopRated = () => {
    const [listings, setlistings] = useState <String []>([])
    const isLoading = useSelector((state:RootState)=>state.LoaderSlice.value)


    const dispatch = useDispatch()
    const listingsData:any = useSelector((state: RootState) => state.AllListingsSlice.value)


    useEffect(()=>{
      dispatch(LoaderStatus(true))
        axios.post("/api/topRated").then(res=>{
            // console.log(res.data)
            dispatch(LoaderStatus(false))
            setlistings(res.data.newData)
            dispatch(allListingsData(res.data))
        }).catch(err=>{console.log(err)})
    },[])
  return (<>
   {isLoading===true?<>
      <Loader loading={isLoading}/>
     </>:<> </>}
               {listingsData.newData?listingsData.newData.map((item : any)=>{
        return (
            
       <ListingCard key={item._id || item.listing_url.substring(item.listing_url.lastIndexOf('/') + 1)} listing={item}/>
        )

    })
    :
    "NO data found"}
    <Pagination dataFrom="topRated" page={listingsData.page}/>
              
 
   
    </>
  )
}
