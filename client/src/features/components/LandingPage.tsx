import axios from 'axios'
import React,{useEffect, useState} from 'react'
import ListingCard from './ListingCard'

import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '../../app/store'
import { allListingsData } from '../AllListingsReducer/AllListingsSlice'
import { AdvanceFiltersModal } from './AdvanceFiltersModal'
import { Pagination } from './common/Pagination'

import { LoaderStatus } from '../LoaderReducer/LoaderSlice'
import { SearchListingBar } from './common/SearchListingBar'
import axiosRetry from 'axios-retry'




export const LandingPage = () => {
    const [listings, setlistings] = useState <String []>([])
  const isLoading = useSelector((state:RootState)=>state.LoaderSlice.value)

  
  let [selectedPriceState, setSelectedPriceState]= useState<String>()
    const dispatch = useDispatch()
    const [filterPresent, setFilterPresent] = useState(false)
  let listingsData : any = useSelector((state: RootState) => state.AllListingsSlice.value)
  // @ts-ignore
  let listingsDataAmenities : any = useSelector((state: RootState) => state.AllListingsSlice.value?.amenities)
   // @ts-ignore
   let listingsDataPRange : any = useSelector((state: RootState) => state.AllListingsSlice.value?.priceRange)
   // @ts-ignore
   let listingsDataCountry : any = useSelector((state: RootState) => state.AllListingsSlice.value?.country)
  
  // console.log("lisyin data pRange no::", listingsDataPRange)
  
  const clearFilters = ()=>{
    axios.post("/api/getAll").then(res=>{
            // console.log(res.data)
            LoaderStatus(false)
            setlistings(res.data.newData)
            dispatch(allListingsData(res.data))
            localStorage.removeItem("SelectedAmenity")
            localStorage.removeItem("SelectedPrice")  
            localStorage.removeItem("SelectedCountry")  
            setFilterPresent(false)
        }).catch(err=>{console.log(err)})
  }
  axiosRetry(axios, {
    retries: 5, // number of retries
    retryDelay: (retryCount) => {
        console.log(`retry attempt: ${retryCount}`);
        return retryCount * 2000; // time interval between retries
    },
    // @ts-ignore
    retryCondition: (error) => {
        // if retry condition is not specified, by default idempotent requests are retried
        // @ts-ignore
        return error;
    },
});
    useEffect(()=>{
      dispatch(LoaderStatus(true))
      let SelectedAmenity = JSON.parse(localStorage.getItem("SelectedAmenity") || '{}')
      let SelectedPrice = JSON.parse(localStorage.getItem("SelectedPrice") || '{}')
      let SelectedCountry = JSON.parse(localStorage.getItem("SelectedCountry") || '{}')
      if(SelectedAmenity.length>0 || SelectedPrice.length>0 || SelectedCountry.length>0){
        // console.log("LOcal storage vals:", SelectedAmenity, SelectedPrice)
        setFilterPresent(true)
        axios({
  
          method: 'post',
          
          url: '/api/getAll',
          
          data:{amenities:SelectedAmenity,priceRange:SelectedPrice, country: SelectedCountry}, 

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
          localStorage.setItem("SelectedCountry",JSON.stringify(SelectedCountry))
          
      }).catch(err=>{console.log(err)})
    }
    else{
       axios.post("/api/getAll").then(res=>{
            dispatch(LoaderStatus(false))
            setlistings(res.data.newData)
            dispatch(allListingsData(res.data))
            localStorage.removeItem("SelectedAmenity")
            localStorage.removeItem("SelectedPrice") 
            localStorage.removeItem("SelectedCountry") 
        }).catch(err=>{console.log(err)})
    }
   
    },[])
    const filterStateSetter= ()=>{
      // console.log("finction called")
      setFilterPresent(true)
    }
    useEffect(()=>{
      if(listingsDataPRange && listingsDataPRange === 1001){
        setSelectedPriceState("Above $1000")
       }
     else if(listingsDataPRange && listingsDataPRange === 1000)  {
      setSelectedPriceState("$501 to $1000")
     }
     else if(listingsDataPRange && listingsDataPRange === 500)  {
      setSelectedPriceState("$101 to $500")
     }
     else if(listingsDataPRange && listingsDataPRange === 100){
      setSelectedPriceState("Under $100")
     }
    },[listingsDataPRange])
  return (<>
  
 <SearchListingBar />
 {isLoading===false? <>
               <div className='container d-flex align-items-center flex-wrap'>
  <div className='m-1'>
 <AdvanceFiltersModal filterStateSetter={filterStateSetter} />
 </div>
 {filterPresent?
 <>
 <div className='m-1'>
 <button type='button' className='btn btn-dark customBtnHover' onClick={clearFilters}>Clear Filters</button>
 </div>
 <div className='amenityContainer px-2 d-flex align-items-center flex-wrap'>
  {listingsDataAmenities?.length>11 ? "":
  <>
{listingsDataAmenities?.length>4 ? 
 <><>
 <div><b><i>Selected Amenities :  </i></b></div>
{listingsDataAmenities?.slice(0,4).map((amenity:String,index:Number)=>{
           return <span className="badge bg-light custom-badge" style={{width:"auto !important"}} key={index as number}>{amenity}</span>
         })}<span>.......</span>
        
</></>
 :<>
  <div><b><i>Selected Amenities : </i></b></div>
 {listingsDataAmenities?.map((amenity:String,index:Number)=>{
            return <span className="badge bg-light custom-badge" style={{width:"auto !important"}} key={index as number}>{amenity}</span>
          })}
         
 </>}
  </>
  }
 </div>
 <div className='priceContainer px-2 d-flex align-items-center'>
        {listingsDataCountry?.length>0? <>
 <div><b><i>Country : </i></b></div>
          <span className="badge bg-light custom-badge" style={{width:"auto !important"}} >{listingsDataCountry[0].value}</span>
        </>:""}
 </div>
 <div className='priceContainer px-2 d-flex align-items-center'>
        {selectedPriceState && listingsDataPRange? <>
 <div><b><i>Price Range : </i></b></div>
          <span className="badge bg-light custom-badge" style={{width:"auto !important"}} >{selectedPriceState}</span>
        </>:""}
 </div>

 
 </>:""
}

 </div>
 </>:""}
    {listingsData.newData?listingsData.newData.map((item : any)=>{
        return (
            
       <ListingCard key={item._id || item.listing_url.substring(item.listing_url.lastIndexOf('/') + 1)} listing={item}/>
        )

    })
  
    :
    ""}
    {isLoading===false?<> <Pagination dataFrom="getAll" page={listingsData.page}/></>:""}
   
              


  
 
    </>
  )
}
