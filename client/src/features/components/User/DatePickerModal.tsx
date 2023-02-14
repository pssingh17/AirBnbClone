import React, { useState,useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import { useSelector } from 'react-redux'
import { MultiSelect } from "react-multi-select-component";
import axios from 'axios';
import { useDispatch } from 'react-redux'
import { DatePicker } from './DatePicker';
import { useNavigate } from 'react-router-dom';





export function DatePickerModal() {
  const [show, setShow] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState<any[]>([]);
  const [selectedAmenity, setSelectedAmenity] = useState<any[]>([]);
  const [listings, setlistings] = useState <String []>([])
    const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleClose = ()=>{setShow(false)}
  const handleShow = () => setShow(true);
  const Payment = () => {
    return navigate("/user/payment");
  };

  return (
    <>
      <Button className='mt-auto m-1 px-5 customBtnHover' variant="dark" onClick={handleShow}>
        Reserve this place
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Select Date</Modal.Title>
        </Modal.Header>
        <Modal.Body>
  
        <DatePicker />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <button
                  className="slign-self-end float-end btn btn-dark mt-auto m-1 customBtnPosition"
                  onClick={Payment}
                >
                  Book Now
                </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

