import React ,{useState}from 'react'
import { ListingDataInterface } from '../../model/ListingDataInterface'
import type { RootState } from '../../app/store'
import { useSelector ,useDispatch} from 'react-redux'
import { viewDetailsData } from '../ViewDetailsReducer/ViewDetailsSlice'
import { useNavigate } from 'react-router-dom'

interface listingsProp{
  listing: ListingDataInterface
}

const ListingCard = (props: listingsProp) => {
  const [errorImage, setErrorImage] = useState("https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2")
  const navigate = useNavigate()
  const dispatch = useDispatch();
  // const listingsData = useSelector((state: RootState) => state.AllListingsSlice.value)
    let style={
        width: "18rem"
    }
    // console.log("Listing daat redux:", listingsData)
    // listingsData ? listingsData.map((listing:ListingDataInterface)=>{
    //   console.log("Listinf name:", listing.name)
    // }):""
    const ViewDetails = (data:any)=>{
      if(data){

        // console.log("View details console:", data)
        dispatch(viewDetailsData(data))
        localStorage.setItem("LastViewDetailPage",JSON.stringify(data))
        return navigate('/viewDetails')
      }
    }
    // @ts-ignore
    const replaceImage = (error) => {
      //replacement of broken Image
      error.target.src = errorImage; 
  }
  return (
    
    <div className="card col-sm-4 m-2 p-1 customHover customListingCardStyle" onClick={()=>{ViewDetails(props.listing)}} >
      {props.listing.images?
       <img style={{width:"100%",height:"200px"}}src={props.listing.images.picture_url} className="card-img-top" alt="No image found" onError={replaceImage}/> :
       <img style={{width:"100%",height:"200px"}} src="https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" className="card-img-top" alt="No image" />
      }
 
  <div className="card-body d-flex flex-column">
    <h6 className="card-title text-start">{props.listing.name.slice(0,30)}...</h6>
    
    {props.listing.summary?<p className=" text-start" style={{ marginBottom: "3px"}}>{props.listing.summary.slice(0,100)}...</p>:""}
    {props.listing.review_scores?.review_scores_rating?<b className="card-text text-start mt-auto">Average Rating : {props.listing.review_scores.review_scores_rating}</b>:<b className="card-text text-start mt-auto">Average Rating : NA</b>}
    <b className='text-start'>Price: ${props.listing.price} </b>
   
    {/* <button  className="slign-self-end btn btn-dark mt-auto m-1 customBtnPosition" onClick={()=>{ViewDetails(props.listing)}}>View Details</button> */}
    
   </div>
  </div>
  

  )
}

export default ListingCard