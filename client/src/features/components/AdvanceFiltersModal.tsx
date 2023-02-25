import React, { useState,useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import type { RootState } from '../../app/store'
import { useSelector } from 'react-redux'
import { MultiSelect } from "react-multi-select-component";
import axios from 'axios';
import { useDispatch } from 'react-redux'
import { allListingsData } from '../AllListingsReducer/AllListingsSlice'
import { LoaderStatus } from '../LoaderReducer/LoaderSlice';




export function AdvanceFiltersModal(filterStateSetter:any) {
  const [show, setShow] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState<any[]>([]);
  const [selectedAmenity, setSelectedAmenity] = useState<any[]>([]);
  const [listings, setlistings] = useState <String []>([])
    const dispatch = useDispatch()
  let listingsData : any = useSelector((state: RootState) => state.AllListingsSlice.value)
  let amenities = listingsData.totalAmenities
  const applyFilters = () =>{ 
    dispatch(LoaderStatus(true))
    // console.log("slected price:", selectedPrice)
    axios({
      
      method: 'post',
      
      url: '/api/getAll',
      
      data:{amenities:selectedAmenity,priceRange:selectedPrice}, 
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      }
    }).then(res=>{
      // console.log(res.data)
      setlistings(res.data.newData)
      dispatch(allListingsData(res.data))
      dispatch(LoaderStatus(false))
      localStorage.setItem("SelectedAmenity",JSON.stringify(selectedAmenity))
      localStorage.setItem("SelectedPrice",JSON.stringify(selectedPrice))
      filterStateSetter.filterStateSetter()
  }).catch(err=>{console.log(err)})
    setShow(false)};

  const handleClose = ()=>{setShow(false)}
  const handleShow = () => setShow(true);
  const price = [
    { label: "Under $100", value: "100" },
    { label: "$101 to $500", value: "500" },
    { label: "$501 to $1000", value: "1000"},
    { label: "Above $1000", value: "1001" },
    // { label: "Under $1000 🍓", value: "Under $1000", disabled: true },
  ];
  const amenity:any = [
    // { label: "Under $1000 🍓", value: "Under $1000", disabled: true },
  ];
  
  amenities?.map((item:String)=>{
    amenity.push({label:item,value:item})
  })
  

  return (
    <>
      <Button className='customBtnHover custom-adv-fil' variant="dark" onClick={handleShow}>
        Advance Filters
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Filters</Modal.Title>
        </Modal.Header>
        <Modal.Body>
    <div>
     <h5>Amenities</h5>
      {/* <pre>{JSON.stringify(selectedAmenity)}</pre>
      <pre>{JSON.stringify(selectedPrice)}</pre> */}
      <MultiSelect
        options={amenity}
        value={selectedAmenity}
        onChange={setSelectedAmenity}
        disableSearch={true}
        labelledBy="Select"
      />
    </div>
    <div>
      <h5>Price</h5>
      {/* <pre>{JSON.stringify(selected)}</pre> */}
      <MultiSelect
        options={price}
        value={selectedPrice}
        onChange={setSelectedPrice}
        disableSearch={true}
        closeOnChangedValue={true}
        labelledBy="Select"
      />
    </div>
        </Modal.Body>
        <Modal.Footer>
          <Button className='customBtnHover' variant="dark" onClick={handleClose}>
            Close
          </Button>
          <Button className='customBtnHover' variant="dark" onClick={applyFilters}>
            Apply Filter
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

