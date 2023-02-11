import axios from 'axios'
import React,{useEffect, useState} from 'react'
import ListingCard from './ListingCard'

import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '../../app/store'
import { allListingsData } from '../AllListingsReducer/AllListingsSlice'
import { AdvanceFiltersModal } from './AdvanceFiltersModal'
import { Pagination } from './common/Pagination'
import { Loader } from './Loader'
import { LoaderStatus } from '../LoaderReducer/LoaderSlice'





export const LandingPage = () => {
    const [listings, setlistings] = useState <String []>([])
  const isLoading = useSelector((state:RootState)=>state.LoaderSlice.value)


    const dispatch = useDispatch()
    const [filterPresent, setFilterPresent] = useState(false)
  let listingsData : any = useSelector((state: RootState) => state.AllListingsSlice.value)
  // console.log("lisyin data page no::", listingsData.page)
  
  const clearFilters = ()=>{
    axios.post("/api/getAll").then(res=>{
            // console.log(res.data)
            LoaderStatus(false)
            setlistings(res.data.newData)
            dispatch(allListingsData(res.data))
            localStorage.removeItem("SelectedAmenity")
            localStorage.removeItem("SelectedPrice")  
            setFilterPresent(false)
        }).catch(err=>{console.log(err)})
  }
    
    useEffect(()=>{
      let SelectedAmenity = JSON.parse(localStorage.getItem("SelectedAmenity") || '{}')
      let SelectedPrice = JSON.parse(localStorage.getItem("SelectedPrice") || '{}')
      if(SelectedAmenity.length>0 || SelectedPrice.length>0){
        // console.log("LOcal storage vals:", SelectedAmenity, SelectedPrice)
        setFilterPresent(true)
        axios({
  
          method: 'post',
          
          url: '/api/getAll',
          
          data:{amenities:SelectedAmenity,priceRange:SelectedPrice}, 

          headers: {
            'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
          }
        }).then(res=>{
          // console.log(res.data)
          dispatch(LoaderStatus(false))
          setlistings(res.data.newData)
          dispatch(allListingsData(res.data))
          localStorage.setItem("SelectedAmenity",JSON.stringify(SelectedAmenity))
          localStorage.setItem("SelectedPrice",JSON.stringify(SelectedPrice))
      }).catch(err=>{console.log(err)})
    }
    else{
       axios.post("/api/getAll").then(res=>{
            dispatch(LoaderStatus(false))
            setlistings(res.data.newData)
            dispatch(allListingsData(res.data))
            localStorage.removeItem("SelectedAmenity")
            localStorage.removeItem("SelectedPrice") 
        }).catch(err=>{console.log(err)})
    }
       
    },[])
    const filterStateSetter= ()=>{
      // console.log("finction called")
      setFilterPresent(true)
    }
  return (<>
 {isLoading===true?<>
      <Loader loading={isLoading}/>
     </>:<>
               <div className='container d-flex'>
  <div className='m-1'>
 <AdvanceFiltersModal filterStateSetter={filterStateSetter} />
 </div>
 {filterPresent?
 <div className='m-1'>
 <button type='button' className='btn btn-dark' onClick={clearFilters}>Clear All</button>
 </div>:""
}
 
 </div>
    {listingsData.newData?listingsData.newData.map((item : any)=>{
        return (
            
       <ListingCard key={item._id || item.listing_url.substring(item.listing_url.lastIndexOf('/') + 1)} listing={item}/>
        )

    })
  
    :
    "NO data found"}
    
    <Pagination dataFrom="getAll" page={listingsData.page}/>
              
</>}

  
 
    </>
  )
}
