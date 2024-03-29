import React,{useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '../../../app/store'
import { allListingsData } from '../../AllListingsReducer/AllListingsSlice'
import axios from 'axios'
import { searchListingData } from '../../SearchListingReducer/SearchListingSlice'
import { LoaderStatus } from '../../LoaderReducer/LoaderSlice'

interface Page{
  dataFrom: String
  page?:Number
}
export const Pagination = ({dataFrom,page}:Page) => {
  const [listings, setlistings] = useState <String []>([])
  const dispatch = useDispatch()
    const listingsData = useSelector((state: RootState) => state.AllListingsSlice.value)
    // @ts-ignore
    const listingsDataCheck = useSelector((state: RootState) => state.AllListingsSlice.value.newData)
    const searchlistingsData:any = useSelector((state: RootState) => state.SearchListingSlice.value)
    // @ts-ignore
    const searchlistingsDataCheck = useSelector((state: RootState) => state.SearchListingSlice.value.newData)
    // console.log("Paginated gets page no. : ", dataFrom,page)
    const nextPage = ()=>{
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
    });
      if(dataFrom == "getAll" ){
        if(listingsDataCheck?.length>1){
      dispatch(LoaderStatus(true))
          
             // @ts-ignore
      page = page+1
          let SelectedAmenity = JSON.parse(localStorage.getItem("SelectedAmenity") || '{}')
          let SelectedPrice = JSON.parse(localStorage.getItem("SelectedPrice") || '{}')
          let SelectedCountry = JSON.parse(localStorage.getItem("SelectedCountry") || '{}')
      if(SelectedAmenity.length>0 || SelectedPrice.length>0 || SelectedCountry.length>0){
            // console.log("LOcal storage vals:", SelectedAmenity, SelectedPrice)
            axios({
      
              method: 'post',
              
              url: '/api/getAll',
              
              data:{amenities:SelectedAmenity,priceRange:SelectedPrice,country:SelectedCountry, page:page}, 

              headers: {
                'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
              }
            }).then(res=>{
              // console.log(res.data)
              if(res?.data?.newData?.length>0){
              setlistings(res.data.newData)
              dispatch(allListingsData(res.data))
              localStorage.setItem("SelectedAmenity",JSON.stringify(SelectedAmenity))
              localStorage.setItem("SelectedPrice",JSON.stringify(SelectedPrice))
              localStorage.setItem("SelectedCountry",JSON.stringify(SelectedCountry))
              }
              dispatch(LoaderStatus(false))

              
          }).catch(err=>{console.log(err)})
          }
      else{
        axios({
        
          method: 'post',
          
          url: `/api/${dataFrom}`,
          data:{page:page},
          headers: {
            'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
          }
        }).then(res=>{
          // console.log(res.data)
          if(res?.data?.newData?.length>0){
          setlistings(res.data.newData)
          dispatch(allListingsData(res.data))
          // console.log(res.data)
          }
          dispatch(LoaderStatus(false))

        }).catch(err=>{console.log(err)})
      }
      
      }
    }
      else if(dataFrom=== "search"){
        // console.log("searchlistingsDataCheck:",searchlistingsDataCheck)
        if(searchlistingsDataCheck){
          if(searchlistingsDataCheck?.length>1){
          dispatch(LoaderStatus(true))

            // @ts-ignore
page = page+1
axios({
  
  method: 'post',
  
  url: `/api/${dataFrom}`,
  data:{page:page,"searchString":searchlistingsData.query},
  headers: {
    'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
  }
}).then(res=>{
  // console.log(res.data)
  if(res?.data?.newData?.length>0){
    setlistings(res.data.newData)
    dispatch(searchListingData(res.data))
  }
  dispatch(LoaderStatus(false))
 
  // console.log(res.data)
}).catch(err=>{console.log(err)})

  }
        }
       
     
      }
      else{
        if(listingsDataCheck?.length>0){
    dispatch(LoaderStatus(true))

         // @ts-ignore
      page = page+1
      axios({
        
        method: 'post',
        
        url: `/api/${dataFrom}`,
        data:{page:page},
        
      }).then(res=>{
        // console.log(res.data)
        if(res?.data?.newData?.length>0){
        setlistings(res.data.newData)
        dispatch(allListingsData(res.data))
        }
    dispatch(LoaderStatus(false))

        // console.log(res.data)
      }).catch(err=>{console.log(err)})
      }
    }
     
    }
    const previousPage = ()=>{
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
    });
      if(dataFrom==="getAll"){
          // @ts-ignore
       if(page>=2){
        // @ts-ignore
       page = page-1
      }
      else{
       page=1
      }
      dispatch(LoaderStatus(true))
      
      let SelectedAmenity = JSON.parse(localStorage.getItem("SelectedAmenity") || '{}')
      let SelectedPrice = JSON.parse(localStorage.getItem("SelectedPrice") || '{}')
      let SelectedCountry = JSON.parse(localStorage.getItem("SelectedCountry") || '{}')
      if(SelectedAmenity.length>0 || SelectedPrice.length>0 || SelectedCountry.length>0){
        // console.log("LOcal storage vals:", SelectedAmenity, SelectedPrice)
        axios({
  
          method: 'post',
          
          url: '/api/getAll',
          
          data:{amenities:SelectedAmenity,priceRange:SelectedPrice,country:SelectedCountry, page:page}, 

          headers: {
            'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
          }
        }).then(res=>{
          if(res?.data?.newData?.length>0){
          // console.log(res.data)
          setlistings(res.data.newData)
          dispatch(allListingsData(res.data))
          localStorage.setItem("SelectedAmenity",JSON.stringify(SelectedAmenity))
          localStorage.setItem("SelectedPrice",JSON.stringify(SelectedPrice))
          localStorage.setItem("SelectedCountry",JSON.stringify(SelectedCountry))
          }
          dispatch(LoaderStatus(false))

      }).catch(err=>{console.log(err)})
      }
      else{
        axios({
        
          method: 'post',
          
          url: `/api/${dataFrom}`,
          data:{page:page},
          headers: {
            'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
          }
          
        }).then(res=>{
        //  console.log(res.data)
         // console.log(res.data)
         if(res?.data?.newData?.length>0){
         setlistings(res.data.newData)
         dispatch(allListingsData(res.data))
         }
         dispatch(LoaderStatus(false))

       }).catch(err=>{console.log(err)})
      }
     
      }
      else if(dataFrom ==="search"){
          // @ts-ignore
       if(page>=2){
        // @ts-ignore
       page = page-1
      }
      else{
       page=1
      }
      
      axios({
        
        method: 'post',
        
        url: `/api/${dataFrom}`,
        data:{page:page,"searchString":searchlistingsData.query},
        headers: {
          'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
        }
        
      }).then(res=>{
      //  console.log(res.data)
      if(res?.data?.newData?.length>0){
       // console.log(res.data)
       setlistings(res.data.newData)
       dispatch(searchListingData(res.data))
      }
      dispatch(LoaderStatus(false))

     }).catch(err=>{console.log(err)})
      }
      else{
          // @ts-ignore
       if(page>=2){
        // @ts-ignore
       page = page-1
      }
      else{
       page=1
      }
      
      axios({
        
        method: 'post',
        
        url: `/api/${dataFrom}`,
        data:{page:page},
        
      }).then(res=>{
      //  console.log(res.data)
       // console.log(res.data)
       if(res?.data?.newData?.length>0){
       setlistings(res.data.newData)
       dispatch(allListingsData(res.data))
       }
       dispatch(LoaderStatus(false))

     }).catch(err=>{console.log(err)})
      }
     
    }
  return (
    <>
    <div className='container d-flex justify-content-between'>
    <div className='m-1'>
    <button type='button' className='btn btn-dark px-3 customBtnHover' onClick={previousPage}>Previous Page</button>
   
   </div>
   <div className='m-1'>
   <button type='button' className='btn btn-dark px-3 customBtnHover' onClick={nextPage}>Next Page  </button>
   </div>
   </div>
   
    </>
    
  )
}
